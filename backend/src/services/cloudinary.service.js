
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const uploadFile = async ({ filePath, folder }) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "raw",
  access_mode: "public"
  });

  // cleanup temp file
  fs.unlinkSync(filePath);

  return {
    file_url: result.secure_url,
    public_id: result.public_id,
    file_type: result.resource_type,
    file_size: result.bytes
  };
};

export {
  uploadFile
};
