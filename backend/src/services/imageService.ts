import AWS from "aws-sdk";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

AWS.config.update({
  region: process.env.AWS_REGION || "us-east-1", // Default to us-east-1 if not specified
});

const s3 = new AWS.S3();
const bucket = process.env.BUCKET_NAME || "image-resizer-bucket";

export const uploadToS3 = async (
  file: Express.Multer.File
): Promise<string> => {
  const fileContent = await fs.readFile(file.path);

  const params = {
    Bucket: bucket,
    Key: `original/${file.originalname}`,
    Body: fileContent,
    ContentType: file.mimetype,
  };

  await s3.upload(params).promise();
  await fs.unlink(file.path);

  return `https://${bucket}.s3.amazonaws.com/original/${file.originalname}`;
};

export const getS3ImageList = async (): Promise<
  { name: string; url: string }[]
> => {
  const params = { Bucket: bucket, Prefix: "original/" };
  const response = await s3.listObjectsV2(params).promise();

  return (
    response.Contents?.map((item) => ({
      name: path.basename(item.Key!),
      url: `https://${bucket}.s3.amazonaws.com/${item.Key}`,
    })) || []
  );
};

export const resizeImage = async (
  width: number,
  height: number,
  s3ObjectKey: string
): Promise<Buffer> => {
  const originalKey = `original/${s3ObjectKey}`;
  const resizedKey = `${width}x${height}/${s3ObjectKey}`;

  // Check if the resized image already exists
  try {
    await s3.headObject({ Bucket: bucket, Key: resizedKey }).promise();
    const resizedImage = await s3
      .getObject({ Bucket: bucket, Key: resizedKey })
      .promise();
    return resizedImage.Body as Buffer;
  } catch {
    // Resized image doesn't exist; create it
    const originalImage = await s3
      .getObject({ Bucket: bucket, Key: originalKey })
      .promise();

    const resizedImage = await sharp(originalImage.Body as Buffer)
      .resize(width, height)
      .toBuffer();

    await s3
      .upload({
        Bucket: bucket,
        Key: resizedKey,
        Body: resizedImage,
        ContentType: "image/jpeg",
      })
      .promise();

    return resizedImage;
  }
};
