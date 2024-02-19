const multer=require("multer");

const storage=multer.memoryStorage();

exports.profileUploader=multer({storage:storage}).single('profile');