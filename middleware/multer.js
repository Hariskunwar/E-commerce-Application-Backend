const multer=require("multer");

const storage=multer.memoryStorage();

exports.photoUploader=multer({storage:storage}).single('image');

