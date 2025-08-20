import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (files: Express.Multer.File[]) => {
  try {
    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }

    if (files.length > 3) {
      throw new Error("You can upload a maximum of 3 files");
    }

    // Upload all files in parallel
    const uploadResults = await Promise.all(
      files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          resource_type: "raw",
          folder: "pdf_uploads"
        })
      )
    );

    files.forEach((file) => fs.unlinkSync(file.path));
    

    return uploadResults.map((result) => result.secure_url);

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export { uploadOnCloudinary };
