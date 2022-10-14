const mongoose = require('mongoose');

// const PostSchema = new mongoose.Schema({
//     // Post modeling 
//     caption: {
//         type: String
//     },
//     photos: [String],
//     // comment: []
// })

const UserSchema = new mongoose.Schema({
    // database modeling
    name: {
        type: String
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: Number
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'others'],
    },
    bio: {
        type: String
    },
    // posts: [PostSchema],
    dob: {
        type: Date
    },
    profilePicture: {
        type: String
    },
    website: {
        type: String
    },
    AccountPrivacy: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    }
})

module.exports = mongoose.model('User', UserSchema)

