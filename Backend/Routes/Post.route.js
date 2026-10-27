const express = require('express')
const route = express.Router()
const upload = require('../Middleware/upload.middleware')
const protect = require('../Middleware/auth.middleware')
const postController = require('../Controller/Post.controller')

route.post('/createpost', upload.array("images", 5),protect, postController.createPost)
route.get('/getall', postController.getAllPost)

module.exports = route