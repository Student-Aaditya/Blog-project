const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.cloud_Name,
    api_key:process.env.cloud_API_Key,
    api_secret:process.env.cloud_Secret_Nmae,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Image',
      allowedformat: ["jpg","jpeg","png","pdf"],  
    },
  });

module.exports={
    cloudinary,storage
}