const followerModel = require("../../models/follower.model");

function getFollower(req,res,next){
    followerModel.findOne({
        user:req.user.id,
    }, function(err,follower){
        if(err){
            return next(err)
        }
        if(!follower){
            return next({
                msg: 'Follower not found',
                status: 404
            })
        }
        res.json({
            msg: follower
        })
    })
}

function addFollower(req,res,next){
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
    addFollower,
    unFollow
}