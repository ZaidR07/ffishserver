import { Router } from "express";
import { adminlogin } from "./controllers/admin.js";
import uploadMiddleware, { singleupload } from "./middlewares/upload.js";
import { addCarouselImages, deletecarouselimage, getcarouselimages } from "./controllers/carousel.js";
import { addGalleryImages, deletegalleryimage, getgalleryimages } from "./controllers/gallery.js";
import { addproduct, deleteProduct, getproducts, updateProduct} from "./controllers/product.js";
import { adduser, deleteopdslot, getopds, sendotp, verifyotp } from "./controllers/user.js";
import { AddService, getServices } from "./controllers/services.js";
import { addReview, getReviews } from "./controllers/reviews.js";
import { GetAbout, UpdateAbout } from "./controllers/general.js";
import { getDashboardNumbers } from "./controllers/dashboard.js";
import { addquery, getqueries } from "./controllers/contact.js";
import { getorders, neworder } from "./controllers/order.js";

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
approuter.post("/api/deleteproduct",deleteProduct);
approuter.post("/api/updateproduct",updateProduct);

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
approuter.get("/api/getqueries", getqueries);


//Order Routes
approuter.post("/api/neworder", neworder);
approuter.get("/api/getorders",getorders);


export default approuter;


              
           

