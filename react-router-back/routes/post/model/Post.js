const mongoose = require('mongoose')
const moment = require('moment')
const now = moment();

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: "text is required"
    },
    photo: {
        type: String,
        default: ''
    },
    likes: [{
        type: mongoose.Schema.ObjectId, ref: "User"
    }],
    comments: [{
        type: String,
        created: {
            type: String,
            default: now.format('dddd, MMMM Do YYYY, h:mm:ss a')
        },
        postedBy: {
            type: mongoose.Schema.ObjectId, ref: 'User'
        }
    }],
    postedBy: {
        type: mongoose.Schema.ObjectId, ref: 'User'
    },
    created: {
        type: String,
        default: () => {
            const now = moment();
            return now.format('dddd, MMMM Do YYYY, h:mm:ss a');
        }

    }
});

module.exports = mongoose.model('Post', PostSchema)