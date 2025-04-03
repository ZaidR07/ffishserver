import mongoose from "mongoose";
export const UpdateAbout = async (req, res) => {
    try {
        // if (!mongoose.connection.readyState) {
        //     return res.status(500).json({ message: "Database not connected" });
        // }

        const db = mongoose.connection.db;
        const { about } = req.body;

        if (!about || typeof about !== "string") {
            return res.status(400).json({ message: "Invalid about content" });
        }

        const aboutCollection = db.collection("about");
        const existingAbout = await aboutCollection.findOne({});

        if (existingAbout) {
            await aboutCollection.updateOne({}, { $set: { about } });
            return res.status(200).json({ message: "About section updated successfully" });
        } else {
            await aboutCollection.insertOne({ about });
            return res.status(201).json({ message: "About section added successfully" });
        }
    } catch (error) {
        console.error("Error updating about section:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};




export const GetAbout = async (req, res) => {
    try {
        // if (!mongoose.connection.readyState) {
        //     return res.status(500).json({ message: "Database not connected" });
        // }

        console.log("[getabout] Request received"); // Log request start

        const db = mongoose.connection.db;
        const aboutCollection = db.collection("about");
        const aboutData = await aboutCollection.findOne({});

        if (aboutData) {
            return res.status(200).json({ payload: { about: aboutData.about } });
        } else {
            return res.status(404).json({ message: "No about section found" });
        }
    } catch (error) {
        console.error("Error fetching about section:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};