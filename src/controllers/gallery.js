import mongoose from "mongoose";


export const addGalleryImages = async (req, res) => {
  try {
    const { imageUrls } = req; // Get Cloudinary URLs from middleware

    const db = mongoose.connection.db;
    const result = await db.collection("gallery").insertMany(
      imageUrls.map((url) => ({
        imageUrl: url,
        createdAt: new Date(),
        imageid: `${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`
      }))
    );

    res.status(201).json({ message: "Gallery images uploaded successfully", images: result.ops });
  } catch (error) {
    console.error("Error saving images:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getgalleryimages = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const images = await db.collection("gallery").find({}).toArray();

    if (images.length < 0) {
      return res.status(404).json({
        message: "No Gallery Images Found",
      });
    }

    return res.status(200).json({
      payload: images,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deletegalleryimage = async (req, res) => {
  try {
    const { imageid } = req.body;

    if (!imageid) {
      return res.status(400).json({
        message: "No imageid Provided",
      });
    }

    const db = mongoose.connection.db;

    console.log(imageid);
    

    const deleteresponse = await db
      .collection("gallery")
      .deleteOne({ imageid : imageid });

    console.log(deleteresponse,"dvuddvvudubb");


    if (!deleteresponse) {
      return res.status(400).json({
        message: "Deletion Unsuccesfull",
      });
    }

    return res.status(200).json({
      message: "Deletion Successfull",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error ${error}`,
    });
  }
};
