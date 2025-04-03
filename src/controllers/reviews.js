import mongoose from "mongoose";

export const addReview = async (req, res) => {
    try {
        const { stars, name, message } = req.body;
        const db = mongoose.connection.db;

        if (!stars || !name || !message) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        await db.collection("reviews").insertOne({ stars, name, message, createdAt: new Date() });

        return res.status(201).json({ message: "Review added successfully" });
    } catch (error) {
        console.error("Error adding review:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getReviews = async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const reviews = await db.collection("reviews").find().sort({ createdAt: -1 }).toArray();

        return res.status(200).json({ payload: reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
