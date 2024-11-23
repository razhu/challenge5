import { Request, Response } from "express";
import {
  uploadToS3,
  getS3ImageList,
  resizeImage,
} from "../services/imageService";

export const uploadImage = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const url = await uploadToS3(file);
  res.json({ success: true, url });
};

export const listImages = async (_req: Request, res: Response) => {
  const images = await getS3ImageList();
  res.json({ images });
};

export const getResizedImage = async (req: Request, res: Response) => {
  const { width, height, s3_object } = req.params;

  try {
    const imageBuffer = await resizeImage(
      Number(width),
      Number(height),
      s3_object
    );
    res.set("Content-Type", "image/jpeg");
    res.send(imageBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
