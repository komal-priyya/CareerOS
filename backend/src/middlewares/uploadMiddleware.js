const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "uploads/");
          // Where should the image be saved
    },
    filename: (req,file,cb)=>{

         const extension = path.extname(file.originalname);
 const uniqueName =Date.now() + "-" + crypto.randomUUID() + extension;
            // What should the saved image be called?
 cb(null, uniqueName);
    }
})

const fileFilter = (req,file,cb)=>{
    const allowedTypes=[
        "image/jpeg",
        "image/png",
        "image/webp"
    ];
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(new Error("Only JPEG,PNG and WebP images are allowed"))
    }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024
  }
});

module.exports = upload;