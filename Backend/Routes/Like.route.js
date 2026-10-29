const express = require('express')
const route = express.Router()
const protect = require('../Middleware/auth.middleware')
const likeController = require('../Controller/Like.controller')

route.post('/likepost/:postId', protect, likeController.likePost)
route.delete('/unlike/:postId',protect, likeController.unLikePost)

module.exports = route