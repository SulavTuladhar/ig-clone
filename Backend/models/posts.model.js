const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    caption: {
        type: String
    },
    images: [String],
    privacy: {
        type: String,
        enum: ['public', 'private'],
        // default: 'public'
    },
    userPrivacy:{
        type: String
    }
})
module.exports = mongoose.model('Post', PostSchema);