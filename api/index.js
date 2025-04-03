import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import ConnectDB from "../src/db.js";
import approuter from "../src/router.js";
import path from "path";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Ensure DB is connected before handling requests
ConnectDB().catch((err) => {
    console.error("[Server] Failed to connect to MongoDB:", err);
});

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));
app.use(cors({ origin: true, credentials: true }));

// Ensure DB is connected before processing requests
app.use(async (req, res, next) => {
    try {
        await ConnectDB();
        next();
    } catch (error) {
        console.error("[Middleware] Database connection failed:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.use(approuter);

// Export for Vercel
export default app;