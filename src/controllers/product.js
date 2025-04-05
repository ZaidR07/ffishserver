import mongoose from "mongoose";


export const addproduct = async (req, res) => {
  try {
    const { productname, category, price , unit , description } = req.body;
    const imageUrl = req.imageUrl; // Cloudinary URL from middleware

    if (!imageUrl || !productname || !category || !price || !unit || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = mongoose.connection.db;

    const result = await db.collection("products").insertOne({
      productname,
      category,
      price,
      unit,
      imageUrl,
      description,
      createdAt: new Date(),
      productid: `${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`,
    });

    res
      .status(201)
      .json({ message: "Product added successfully", doctor: result });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getproducts = async (req, res) => {
  try {
    console.log("[getproducts] Request received"); // Log request start

    const db = mongoose.connection.db;
    if (!db) {
      console.error("[getproducts] Database connection not found");
      return res.status(500).json({ message: "Database connection failed" });
    }
    console.log("[getproducts] Database connection established");

    // Fetch products collection
    console.log("[getproducts] Fetching products from database...");
    const products = await db.collection("products").find({}).toArray();
    
    // Check if products exist
    if (!products || products.length === 0) {
      console.warn("[getproducts] No products found");
      return res.status(404).json({ message: "No Doctors Found" });
    }

    console.log(`[getproducts] Found ${products.length} products, sending response...`);
    return res.status(200).json({ payload: products });

  } catch (error) {
    console.error("[getproducts] Error occurred:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "No id Provided",
      });
    }

    const db = mongoose.connection.db;

    const deletestatus = await db
      .collection("doctors")
      .deleteOne({ doctorid: id});

    if (!deletestatus) {
      return res.status(404).json({
        message: "No doctors Found",
      });
    }

    return res.status(200).json({
      message: "Deletion Succesfull",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
