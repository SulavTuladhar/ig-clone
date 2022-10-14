const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    caption: {
        type: String
    },
    photos: [String]
})
module.exports = mongoose.model('Post', PostSchema);