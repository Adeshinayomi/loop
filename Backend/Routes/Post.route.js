const express = require('express')
const route = express.Router()
const upload = require('../Middleware/upload.middleware')
const protect = require('../Middleware/auth.middleware')
const postController = require('../Controller/Post.controller')

route.post('/createpost', upload.array("images", 5), protect , postController.createPost)
route.get('/getall', protect, postController.getAllPost)
route.get('/getpost/:id', protect, postController.getPostById)
route.get('/getposts', protect, postController.getUserPost)
route.delete('/delete/:id', protect, postController.deletePost)

module.exports = route