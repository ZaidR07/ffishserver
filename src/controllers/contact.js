import mongoose from "mongoose";

export const addquery = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res
      .status(400)
      .json({
        message:
          "All fields (name, email, subject, message) are required.",
      });
  }

  try {
    const db = mongoose.connection.db;

    const newQuery = {
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
      queryid: `${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`,
    };

    const result = await db.collection("queries").insertOne(newQuery);

    if (!result.acknowledged) {
      throw new Error(
        "Insertion failed. MongoDB did not acknowledge the operation."
      );
    }

    res.status(200).json({ message: "Query added successfully" });
  } catch (error) {
    console.error("Error while adding query:", {
      message: error.message,
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Internal Server Error. Please try again later." });
  }
};

export const getqueries = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const queries = await db.collection("queries").find({}).toArray();

    if (queries.length < 0) {
      return res.status(404).json({
        message: "No queries Found",
      });
    }

    return res.status(200).json({
      data: queries,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



