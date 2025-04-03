import mongoose from "mongoose";

export const getDashboardNumbers = async (req, res) => {
    try {
        const db = mongoose.connection.db;

        // Fetch collection names
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);

        // Function to count documents safely
        const safeCount = async (collectionName) => {
            return collectionNames.includes(collectionName) 
                ? db.collection(collectionName).countDocuments() 
                : 0;
        };

        // Fetching counts
        const [users, products, orders] = await Promise.all([
            safeCount("users"),
            safeCount("products"),
            safeCount("orders")
        ]);

        res.status(200).json({
            success: true,
            data: { users, products, orders }
        });
    } catch (error) {
        console.error("Error fetching dashboard numbers:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch dashboard data", 
            error: error.message 
        });
    }
};
