const mongoose = require('mongoose');
const Post = require('../model/Post');
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable')
const User = require('../../users/models/Users')

const dbErrorHelper = require('../../helpers/dbErrorMessage')


async function cloudLoad(url) {
    cloudinary.config({
        cloud_name: "dewbxdvhe",
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    })

    let res = await cloudinary.uploader.upload(url, function (error, result) {
        if (error) {
            return error
        } else {
            return result
        }
    });
    return res
}

async function getTime() {
    let time = await now.format('dddd, MMMM Do YYYY, h:mm:ss a')
    return time
}
module.exports = {
    createPost: async (req, res) => {
        let userID = req.user._id;
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, async (err, fields, files) => {
            try {
                if (files.photo) {
                    let { secure_url } = await cloudLoad(files.photo.path);

                    let newPostObj = {
                        text: fields.text,
                        photo: secure_url,
                        postedBy: userID,
                    }

                    let createdPost = await new Post(newPostObj)
                    let savedCreatedPost = await createdPost.save();

                    let aggregatedPost = await savedCreatedPost
                        .populate('postedBy', '_id username')
                        .execPopulate()

                    // let posts = await Post.find({})
                    //     .populate('postedBy', '_id username')
                    //     .populate('comments.postedBy', '_id username')
                    //     .sort('-created')
                    //     .exec()
                    res.json(aggregatedPost)

                } else {

                    let newPostObj = {
                        text: fields.text,
                        postedBy: userID,
                    }

                    let createdPost = await new Post(newPostObj)
                    let savedCreatedPost = await createdPost.save();


                    // let posts = await Post.find({})
                    //     .populate('postedBy', '_id username')
                    //     .populate('comments.postedBy', '_id username')
                    //     .sort('-created')
                    //     .exec()
                    let aggregatedPost = await savedCreatedPost
                        .populate('postedBy', '_id username')
                        .execPopulate()

                    res.json(aggregatedPost)
                }
            } catch (e) {
                res.status(500).json(dbErrorHelper(e));
            }
        })
    },
    // getAllPosts: async (req, res) => {
    //     try {
    //         let userId = req.user._id;
    //         let posts = await Post.find({})
    //         res.json(posts)
    //     } catch (e) {
    //         console.log(e)
    //         res.status(500).json(dbErrorHelper(e));
    //     }

    // }


    // MY GET POSTs ABOVE
    // Paks get POST below


    getAllPosts: async (req, res) => {
        try {
            let posts = await Post.find({})
                .populate('postedBy', '_id username')
                .populate('comments.postedBy', '_id username')
                .sort('-created')
                .exec()
            res.json(posts)
        } catch (e) {
            console.log(e)
            res.status(500).json(dbErrorHelper(e));
        }

    },
    deletePost: async (req, res) => {
        console.log(req.params.postId, ' From backend bitch')
        try {
            let postToDelete = await Post.findByIdAndDelete(req.params.postId)


            res.send()
        } catch (e) {
            res.status(500).json(dbErrorHelper(e));

        }
    },

    addComment: async (req, res) => {
        // console.log(req.body.data.comment)
        // console.log(req.body.data.postId)
        let id = req.body.data.postId
        let comment = req.body.data.comment
        try {
            let post = await Post.findById(id)
            post.comments.push(comment)
            post.save()
            console.log(post.comments);
            res.send()
        } catch (e) {
            res.status(500).json(dbErrorHelper(e));

        }
    },
    deleteCommentByID: async (req, res) => {
        // console.log(req.params.postId)
        // console.log(req.params.index);

        // let id = req.params.postId
        // let i = req.params.index
        try {
            let success = await Post.findByIdAndUpdate(postId, { $pull: { comments: { _id: commentID } } }, { new: true })
                .populate('comments.postedBy', '_id name')
                .populate('postedBy', '_id name')
                .exec()

            res.json(success)
            // let post = await Post.findById(id)
            // post.comments.splice(i, 1)
            // post.save()
            // res.send(post.comments)
        } catch (e) {
            res.status(500).json(dbErrorHelper(e));

        }
    }

}