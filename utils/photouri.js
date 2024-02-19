const DataURIParser = require("datauri/parser");

const path=require("path");

exports.dataUri=(image)=>{
    
    const parser=new DataURIParser();
    
    const extName=path.extname(image.originalname).toString();
    return parser.format(extName,image.buffer);
}