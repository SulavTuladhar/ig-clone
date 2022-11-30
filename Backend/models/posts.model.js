const mongoose = require('mongoose');
const followerModel = require('./follower.model');
const userModel = require('./user.model');

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    caption: {
        type: String
    },
    images: [String],
    username: {
        type: String
    },
    privacy: {
        type: String,
        enum: ['public', 'private'],
    },
    userPrivacy:{
        type: String
    }
})

PostSchema.pre('save', function(next){
    userModel.findOne({
        _id: this.user
    })
        .then(user=> {
            if(!user){
                next({
                    msg: 'user not found'
                })
            }
            if(this.privacy == undefined){
                this.privacy = user.accountPrivacy
            }
            this.username = user.name;
            next();

        })
        .catch(err=> {
            return next(err)
        })
})
module.exports = mongoose.model('Post', PostSchema);