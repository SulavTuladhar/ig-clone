const map_post_req = require("../../helpers/map_post_req");
const postsModel = require("../../models/posts.model");
const userModel = require("../../models/user.model");

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
    if(data.privacy === ''){
        newPost.privacy = req.user.accountPrivacy;
    }
    newPost.userPrivacy = req.user.accountPrivacy;
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
            return next({
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

function getPostFromPublicUser(req,res,next){
    postsModel.find({}, function(err,posts){
        if(err){
            return next(err)
        }
        if(!posts){
            return next({
                msg: 'posts not found',
                status: 404
            })
        }
        let publicPosts = [];
        posts.forEach(post => {
            if(post.userPrivacy == 'public'){
                publicPosts.push(post)
            }
        });
        res.json(publicPosts)
    })
}

function removePost(req,res,next){
    postsModel.findById(req.params.id, function(err,post){
        if(err){
            return next(err);
        }
        if(!post){
            return next({
                msg: 'Post not found',
                status: 404
            })
        }
        // Post found
        if(post.user != req.user.id){
            return next({
               msg: 'only original creator can delete their post',
               status: 401
            })
        }else{
            post.remove(function(err,removed){
                if(err){
                    return next(err)
                }
                res.json(removed)
            })  
        }     
    })
}

module.exports = {
    createPost,
    update,
    getPostFromPublicUser,
    removePost,
}