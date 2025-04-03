
import mongoose from "mongoose";

export const addopd = async (req, res) => {
    try {
      // Connect to the database
      const db = mongoose.connection.db;
      const { day, slots } = req.body.payload; // Extract data from request
  
      if (!day || !slots || slots.length === 0) {
        return res.status(400).json({ message: "Day and slots are required" });
      }
  
      // Function to generate slot ID (random 6-digit number + timestamp)
      const generateSlotId = () => {
        const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
        return `${randomNum}-${Date.now()}`;
      };
  
      // Add slot ID to each slot
      const updatedSlots = slots.map(slot => ({
        ...slot,
        slotId: generateSlotId(),
      }));
  
      // Check if the day already exists
      const existingOpd = await db.collection("opd").findOne({ day });
  
      if (existingOpd) {
        // Day exists → Update existing OPD by adding new slots
        await db.collection("opd").updateOne(
          { day }, 
          { $push: { slots: { $each: updatedSlots } } } // Append new slots
        );
  
        return res.status(200).json({ message: "OPD slots updated successfully" });
      } else {
        // Day does not exist → Insert new OPD document
        await db.collection("opd").insertOne({
          day,
          slots: updatedSlots,
          createdAt: new Date(),
        });
  
        return res.status(200).json({ message: "OPD schedule added successfully" });
      }
    } catch (error) {
      console.error("Error adding OPD:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  


export const getopds = async (req, res) => {
  try {
    // Connect to the database
    const db = mongoose.connection.db;

    // Fetch all OPD schedules from the 'opd' collection
    const opdSchedules = await db.collection("opd").find().toArray();

    res.status(200).json({ message: "OPD schedules retrieved", payload: opdSchedules });
  } catch (error) {
    console.error("Error fetching OPD schedules:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteopdslot = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Slot ID is required" });
        }

        const db = mongoose.connection.db;

        // Find the OPD entry that contains the slot
        const opdEntry = await db.collection("opd").findOne({ "slots.slotId": id });

        if (!opdEntry) {
            return res.status(404).json({ message: "Slot not found" });
        }

        // Update the OPD document by pulling out the slot with the matching slotId
        await db.collection("opd").updateOne(
            { _id: opdEntry._id },  // Match the OPD entry
            { $pull: { slots: { slotId: id } } } // Remove the slot from the slots array
        );

        return res.status(200).json({ message: "Slot removed successfully" });
    } catch (error) {
        console.error("Error in deleteopdslot:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
