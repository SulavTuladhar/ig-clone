const multer = require('multer');
const path = require('path');

// file filter
function myFilter(req,file,cb){
    var mimeType = file.mimetype.split('/')[0];
    if(mimeType === 'image'){
        cb(null,true);
    }else{
        req.fileTypeError = true;
        cb(null,false);
    }
}

// Taking complete control of uploaded file
const myStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, path.join(process.cwd(), 'uploads/images'));
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({
    storage: myStorage,
    fileFilter: myFilter
})

module.exports = upload;