const map_post_req = require("../../helpers/map_post_req");
const postsModel = require("../../models/posts.model");

function createPost(req,res,next){
    const data = req.body;
    if(req.fileTypeError){
        return next({
            msg: "Invalid File Format",
            status: 400
        });
    }
    if(req.files){
        data.images = req.files.map(function(item,index){
            return item.filename;
        })
    }
    const newPost = new postsModel({});
    map_post_req(newPost,data);
    newPost.user = req.user._id;
    newPost.save()
        .then(function(saved){
            res.json(saved)
        })
        .catch(err=>{
            return err
        })
}

function update(req,res,next){
    const data = req.body;
    postsModel.findById(req.params.id, function(err,post){
        if(err){
            return next(err)
        };

        if(!post){
            return next({
                msg: 'Post not found',
                status: 404
            })
        }

        // Post found
        if(post.user != req.user.id){
            res.json({
               msg: 'only original owener can update their post',
               status: 401
            })
        }else{
            map_post_req(post,data);
            post.save(function(err,done){
                if(err){
                    return next(err)
                }
                res.json(done)
            })
            
        }
    })

}

module.exports = {
    createPost,
    update,
}