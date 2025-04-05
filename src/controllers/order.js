import mongoose from "mongoose";

export const neworder = async (req, res) => {
  try {
    const data = req.body.payload
    

    if (!data) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = mongoose.connection.db;

    const result = await db.collection("orders").insertOne({
      items : data,
      status :true,
      createdAt: new Date(),
      orderid: `${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`,
    });

    res
      .status(200)
      .json({ message: "Order successfully", doctor: result });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ message: "Server error" });
  }
};