const followerModel = require("../../models/follower.model");
const userModel = require("../../models/user.model");

function getFollower(req,res,next){
    followerModel.findOne({
        user:req.user.id,
    }, function(err,follower){
        if(err){
            return next(err)
        }
        if(!follower.followers || follower.followers.length == 0){
            return next({
                msg: 'Follower not found',
                status: 404
            })
        }
        let followerIds = [];
        follower.followers.forEach(follower=> {
            followerIds.push(follower.user)
        })
        userModel.find({
            '_id' : {
                $in: followerIds
            }
        },function(err,users){
            if(err){
                return next(err)
            }
            let followers = [];
            users.forEach(user => {
                let follower = {
                    username: user.username,
                    name: user.username,
                    profilePicture: user.profilePicture
                }
                followers.push(follower)
            })
            res.json({
                msg: followers,
                length: followers.length
            })
        })
    })
}


function getFollowing(req,res,next){
    followerModel.findOne({
        user:req.user.id,
    }, function(err,following){
        if(err){
            return next(err)
        }
        if(!following.following || following.following.length == 0){
            return next({
                msg: 'Follower not found',
                status: 404
            })
        }
        let followingIds = [];
        following.following.forEach(following=> {
            followingIds.push(following.user)
        })
        userModel.find({
            '_id' : {
                $in: followingIds
            }
        },function(err,users){
            if(err){
                return next(err)
            }
            let following = [];
            users.forEach(user => {
                let followingUser = {
                    username: user.username,
                    name: user.username,
                    profilePicture: user.profilePicture
                }
                following.push(followingUser)
            })
            res.json({
                msg: following,
                length: following.length
            })
        })
    })
}


function addFollower(req,res,next){
    if(req.user.id === req.body.id){
        return next({
            msg: 'You can not follow yourself'
        })
    }
    followerModel.findOne({
        user: req.user.id
    },function(err,follower){
        if(err){
            return next(err)
        }
        if(follower){
            const indexFound = follower.following.findIndex(
                (following) => following.user == req.body.id
            )
            if(indexFound !== -1){
                res.json({
                    msg: "already following"
                })
            }else{
                follower.following.push({
                    user: req.body.id
                })
                let data = follower.save()
                // Following side 
                followerModel.findOne({
                    user:req.body.id
                }, function(err,followingSide){
                    if(err) return next(err)
                    if(followingSide){
                        const indexFound = followingSide.followers.findIndex(
                            follower => follower.user == req.user.id
                        )
                        if(indexFound !== -1){
                            res.json({
                                msg: "already Added"
                            })
                        }else{
                            followingSide.followers.push({
                                user: req.user.id
                            })
                            followingSide.save()
                                .then(saved => {console.log(saved)})
                                .catch(err=> {console.log(err);})
                        }
                    }else{
                        const followingSideData = {
                            user: req.body.id,
                            followers: [
                                {
                                    user: req.user.id
                                }
                            ]
                        }
                        followerModel.create(followingSideData)
                            .then(data=> {console.log(err)})
                            .catch(err => {console.log(err)})
                    }
                    data
                        .then(saved => {
                            res.json(saved)
                        })
                        .catch(err => {return err})
                })
            }
        }else{
            // If this user haven't followed anyone until now
            const followerData = {
                user: req.user.id,
                following: [
                    {
                        user: req.body.id
                    }
                ]
            }
            let data = followerModel.create(followerData)
            
            // Following side
            followerModel.findOne({
                user: req.body.id
            },function(err,followingSide){
                if(err){
                    return next(err)
                }
                if(followingSide){
                    followingSide.followers.push({
                        user: req.user.id
                    })
                    followingSide.save()
                        .then(saved => {console.log(saved)})
                        .catch(err=> {console.log(err)})
                }else{
                    const followingSideData = {
                        user: req.body.id,
                        followers: [
                            {
                                user: req.user.id
                            }
                        ]
                    }
                    followerModel.create(followingSideData)
                        .then(data => {console.log(data)})
                        .catch(err=> {console.log(err)})
                }
            })
            data
                .then(data=> {
                    res.json({
                        msg: data
                    })
                })
                .catch(err=> {return next(err)})
            
        }
    })
}

function unFollow(req,res,next){
    followerModel.findOne({
        user: req.user.id
    },function(err,follower){
        if(err){
            return next(err)
        }
        const indexFound = follower.following.findIndex(
            following => following.user == req.body.id
        )
        if(indexFound !==-1){
            follower.following.splice(indexFound, 1)
        }
        // For Following side 
        followerModel.findOne({
            user: req.body.id
        }, function(err,followingSide){
            if(err){
                return next(err)
            }
            const followingSideIndex = followingSide.followers.findIndex(
                follower => follower.user == req.user.id
            )
            if(followingSideIndex !== -1){
                followingSide.followers.splice(followingSideIndex, 1)
            }
            followingSide.save()
                .then(saved => {console.log('saved')})
                .catch(err=> {console.log(err)})
            
        })
        follower.save()
            .then(saved=>{
                res.json({
                    msg: saved
                })
            })
            .catch(err => {
                return next(err)
            })

    })
}

module.exports = {
    getFollower,
    getFollowing,
    addFollower,
    unFollow
}