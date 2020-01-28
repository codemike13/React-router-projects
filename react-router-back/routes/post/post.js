const express = require('express');
const router = express.Router();
const passport = require('passport')
const postController = require('./controller/postController');

router.post('/create-post', passport.authenticate('jwt-user', { session: false }), postController.createPost);

router.get('/get-all-posts', passport.authenticate('jwt-user', { session: false }), postController.getAllPosts)

router.delete('/delete-post-by-id/:postId', passport.authenticate('jwt-user', { session: false }), postController.deletePost)


module.exports = router;