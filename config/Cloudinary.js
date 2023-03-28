require("dotenv").config(); 
const cloudinary = require("cloudinary").v2 ; 
const {CloudinaryStorage} = require("multer-storage-cloudinary"); 

cloudinary.config({
    cloud_name: process.env.CloudinaryName , 
    api_key: process.env.CloudinaryKey , 
    api_secret: process.env.CloudinarySecret, 
}); 

const storage = new CloudinaryStorage({
    cloudinary , 
    allowedFormats : ['jpg','jpeg','png'], 
    params:{
        folder:"Full-Stack-Blog-App",
        transformation:[{height:500 , width:500 , crop:'limit'}]
    }
}); 

module.exports = storage ; 