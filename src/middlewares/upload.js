import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dhiwcbdya",
  api_key: "671947363248368",
  api_secret: "Qg-d7eSe2AJbrluLzVxz2qD4nkg", // Replace with actual API secret
});

// Set Multer Storage (Temporary, before uploading to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10000000 }, // 10MB limit
}).array("images", 10);

// Middleware to upload multiple images to Cloudinary
export const uploadMiddleware = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "Multer error: " + err.message });
    }

    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    try {
      const uploadPromises = files.map((file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "images" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          ).end(file.buffer);
        })
      );

      const imageUrls = await Promise.all(uploadPromises);
      req.imageUrls = imageUrls;
      next();
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      res.status(500).json({ message: "Cloudinary upload failed" });
    }
  });
};

// Middleware to upload a single image to Cloudinary
export const singleupload = (req, res, next) => {
  const uploadSingle = multer({
    storage,
  }).single("image");

  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "Multer error: " + err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      cloudinary.uploader.upload_stream(
        { folder: "images" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: "Cloudinary upload failed" });
          }
          req.imageUrl = result.secure_url;
          next();
        }
      ).end(req.file.buffer);
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      res.status(500).json({ message: "Cloudinary upload failed" });
    }
  });
};

export default uploadMiddleware;