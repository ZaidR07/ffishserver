import mongoose from "mongoose";

export const neworder = async (req, res) => {
  try {
    const data = req.body.payload;
    const email = req.body.email

    if (!data) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = mongoose.connection.db;

    const user = await db.collection("users").findOne({
      email: email,
    });

    
    

    const result = await db.collection("orders").insertOne({
      ...user,
      items: data,
      status: true,
      createdAt: new Date(),
      orderid: `${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`,
    });

    res.status(200).json({ message: "Order successfully", doctor: result });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getorders = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const orders = await db.collection("orders").find({}).toArray();

    if (orders.length < 0) {
      return res.status(404).json({
        message: "No Orders Found",
      });
    }

    return res.status(200).json({
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
