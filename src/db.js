import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.DB || "mongodb+srv://ashtauser:passashta@ashtacluster.oohyu2a.mongodb.net/ashtafb";

let isConnected = false; // Track MongoDB connection status

const ConnectDB = async () => {
    if (isConnected) {
        console.log("[MongoDB] Using existing database connection");
        return;
    }

    try {
        const connectionInstance = await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = connectionInstance.connections[0].readyState;
        console.log(`[MongoDB] Connected successfully to: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("[MongoDB] Connection FAILED:", error);
        throw new Error("Database connection failed");
    }
};

export default ConnectDB;