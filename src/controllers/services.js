import mongoose from "mongoose";

export const AddService = async (req, res) => {
    try {
        if (!mongoose.connection.readyState) {
            return res.status(500).json({ message: "Database not connected" });
        }

        const db = mongoose.connection.db;
        const data = req.body.payload; // Ensure correct request format

        if (!Array.isArray(data)) {
            return res.status(400).json({ message: "Invalid payload format" });
        }

        // Generate service IDs
        const newServices = data.map(service => ({
            servicename: service.servicename, // Ensure proper key
            serviceid: `${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`
        }));

        const servicesCollection = db.collection("services");
        const existingServices = await servicesCollection.findOne({});

        if (existingServices) {
            await servicesCollection.updateOne({}, { $push: { services: { $each: newServices } } });
            return res.status(200).json({ message: "Services updated successfully" });

        } else {
            await servicesCollection.insertOne({ services: newServices });
            return res.status(201).json({ message: "Services added successfully" });
        }
    } catch (error) {
        console.error("Error adding service:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getServices = async (req, res) => {
  try {
    // Connect to the database
    const db = mongoose.connection.db;

    // Fetch all OPD schedules from the 'opd' collection
    const services = await db.collection("services").find().toArray();

    

    res.status(200).json({payload: services[0] });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

