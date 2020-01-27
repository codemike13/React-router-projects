const mongoose = require('mongoose');
const Post = require('../model/Post');
const cloudinary = require('cloudinary').v2;
const moment = require('moment');
const now = moment();
const formidable = require('formidable')

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
                        created: now.format('dddd, MMMM Do YYYY, h:mm:ss a')
                    }

                    let createdPost = await new Post(newPostObj)
                    let savedCreatedPost = await createdPost.save();

                    let aggregatedPost = await savedCreatedPost.populate('postedBy', '_id username')
                    res.json(aggregatedPost)

                } else {
                    console.log('No photo');
                }
            } catch (e) {
                res.status(500).json(dbErrorHelper(e));
            }
        })
    }
}