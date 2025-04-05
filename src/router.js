import { Router } from "express";
import { adminlogin } from "./controllers/admin.js";
import uploadMiddleware, { singleupload } from "./middlewares/upload.js";
import { addCarouselImages, deletecarouselimage, getcarouselimages } from "./controllers/carousel.js";
import { addGalleryImages, deletegalleryimage, getgalleryimages } from "./controllers/gallery.js";
import { addproduct, getproducts} from "./controllers/product.js";
import { adduser, deleteopdslot, getopds, sendotp, verifyotp } from "./controllers/user.js";
import { AddService, getServices } from "./controllers/services.js";
import { addReview, getReviews } from "./controllers/reviews.js";
import { GetAbout, UpdateAbout } from "./controllers/general.js";
import { getDashboardNumbers } from "./controllers/dashboard.js";
import { addquery } from "./controllers/contact.js";

const approuter = Router();

// Dashboard Routes
approuter.get("/api/getdashboardnumbers",getDashboardNumbers);

// Admin Routes
approuter.post("/api/adminlogin", adminlogin);

// Carousel Routes (Using Cloudinary Upload Middleware)
approuter.post("/api/addcarouselimages", uploadMiddleware, addCarouselImages);
approuter.post("/api/deletecarousel", deletecarouselimage);
approuter.get("/api/getcarouselimages", getcarouselimages);

// Gallery Routes (Using Cloudinary Upload Middleware)
approuter.post("/api/addgalleryimages", uploadMiddleware, addGalleryImages);
approuter.post("/api/deletegallery", deletegalleryimage);
approuter.get("/api/getgalleryimages", getgalleryimages);

// Product Routes
approuter.post("/api/addproduct", singleupload , addproduct);
approuter.get("/api/getproducts",getproducts);

// User Routes
approuter.post("/api/adduser", adduser);
approuter.post("/api/sendotp" , sendotp);
approuter.post("/api/verifyotp", verifyotp);
approuter.post("/api/deleteslot", deleteopdslot);


// General Routes
approuter.post("/api/addservices",AddService)
approuter.get("/api/getservices", getServices);


// Reviews Routes
approuter.post("/api/submitreview",addReview);
approuter.get("/api/getreviews", getReviews);


//About Routes
approuter.post("/api/updateabout", UpdateAbout);
approuter.get("/api/getabout",GetAbout);


//Query Routes
approuter.post("/api/addquery", addquery);


export default approuter;

 {/* <p className="text-gray-600 mb-4">
              At AquaFresh, we believe everyone deserves access to the freshest seafood, regardless of where they live. Founded in 2020 by a team of marine biologists and culinary experts, we're on a mission to bring the ocean's bounty directly to your table.
            </p>
            <p className="text-gray-600 mb-4">
              We partner with small-scale fisheries and sustainable farms that share our values of environmental stewardship, fair labor practices, and exceptional quality. Every product we sell can be traced back to its source, ensuring transparency throughout our supply chain.
            </p>
            <p className="text-gray-600 mb-6">
              When you purchase from AquaFresh, you're not just getting premium seafood – you're supporting sustainable fishing practices and helping to preserve our ocean ecosystems for future generations.
            </p> */}

