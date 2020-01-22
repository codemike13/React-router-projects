const express = require('express');
const router = express.Router();
const passport = require('passport')
const postController = require('./controller/postController');

router.post('/create-post/:id', postController.createPost);

module.exports = router;