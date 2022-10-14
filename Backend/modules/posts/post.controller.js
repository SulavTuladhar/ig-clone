function createPost(req,res,next){
    if(req.fileTypeError){
        return next({
            msg: "Invalid File Format",
            status: 400
        });
    }
    if(req.file){
        
    }
}

module.exports = {

}