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

                    let aggregatedPost = await savedCreatedPost.populate('postedBy', '_id username')

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
                    let aggregatedPost = await savedCreatedPost.populate('postedBy', '_id username')

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


        } catch (e) {
            res.status(500).json(dbErrorHelper(e));

        }
    }

}