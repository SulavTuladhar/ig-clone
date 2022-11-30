const mongoose = require('mongoose');

const FollowerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    pending: [
        {
            user:{
                type: mongoose.Schema.Types.ObjectId ,
                ref: 'User'
            }
        }
    ],
    followers: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                username: String
            },
            username: String,
            profilePicutre: String
        }
    ],
    following: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            username: String,
            profilePicture: String
        }
    ]
})

module.exports = mongoose.model('follower', FollowerSchema);