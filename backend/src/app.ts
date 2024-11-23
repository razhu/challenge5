import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import {
  uploadImage,
  listImages,
  getResizedImage,
} from "./controllers/imageController";

dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/images", upload.single("image"), uploadImage);
app.get("/images", listImages);
app.get("/images/:width(\\d+)x:height(\\d+)/:s3_object", getResizedImage);

app.listen(3000, () => console.log("Server running on port 3000"));
