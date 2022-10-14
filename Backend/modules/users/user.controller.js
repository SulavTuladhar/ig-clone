// const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const userModel = require('../../models/user.model');
const MAP_USER_REQ = require('../../helpers/map_user_req');

// Escape regex (for fuzzy search purpose)
function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function getAllUsers(req,res,next){
    var condition = {};
    userModel.find(condition)   
        .sort({
            _id: -1
        })
        .exec(function(err,users){
            if(err){
                return next(err)
            }
            res.json(users)
        })
}

function profile(req,res,next){
    console.log("me here?");
    res.json({
        user: req.user
    })
}

function updateUser(req,res,next){
    const data = req.body;

    if(req.fileTypeError){
        return next({
            msg: "Invalid File Format",
            status: 400
        })
    }
    if(req.file){
        data.image = req.file.filename;
    }
    // console.log('req user ko id >. ', req.user.id);
    // res.json({msg:"Stupid"})
    userModel.findById(req.user.id,function(err,user){
        if(err){
            return next(err);
        }
        if(!user){
            return next({
                msg: "User Not Found",
                status: 404
            })
        }
        var oldImg = user.profilePicture;
        var mappedUpdatedUser = MAP_USER_REQ(user,data);
        mappedUpdatedUser.save(function(err,updated){
            if(err){
                return next(err);
            }
            // Deleting old image
            if(req.file){
                fs.unlink(path.join(process.cwd(), 'uploads/images/' + oldImg), function(err,deleted){
                    if(err){
                        console.log('Error while removing old Image >>', err);
                    }else{
                        console.log('Scuessfully remove old image');
                    }
                })
            }
            res.json(updated)
        })
    })
}

function searchUser(req,res,next){
    if(req.params){
        const regex = new RegExp(escapeRegex(req.params.username), 'gi');
        userModel.find({
            username: regex
        })
            .then(user=>{
                if(user.length < 1){
                    return next({
                        msg: 'user not found',
                        status: 404
                    })
                }
                res.json(user)
            })
    }
}

function findByUsername(req,res,next){
    userModel.findOne({
        username: req.params.username
    })
        .then(user=>{
            if(!user){
                return next({
                    msg: 'user not found',
                    status: 404
                })
            }
            res.json({
                user: user
            })
        })
            
        
}

module.exports = {
    getAllUsers,
    profile,
    updateUser,
    searchUser,
    findByUsername
};