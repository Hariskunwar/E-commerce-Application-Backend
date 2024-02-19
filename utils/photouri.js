const DataURIParser = require("datauri/parser");

const path=require("path");

exports.dataUri=(profile)=>{
    
    const parser=new DataURIParser();
    
    const extName=path.extname(profile.originalname).toString();
    return parser.format(extName,profile.buffer);
}