const express = require('express');
const router = express.Router();
const passport = require('passport')
const postController = require('./controller/postController');

router.post('/create-post', passport.authenticate('jwt-user', { session: false }), postController.createPost);

module.exports = router;