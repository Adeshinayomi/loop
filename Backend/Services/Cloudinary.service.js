// import { randomUUID } from "node:crypto";
const {randomUUID} = require('node:crypto')
const cloudinary = require('../Config/CloudinaryConfig')

exports.uploadProfilePicture = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "profile-pictures",
        public_id: randomUUID(),
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
};

exports.deleteProfilePicture = (publicId) => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
};