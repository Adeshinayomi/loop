const express = require('express')
const route = express.Router()
const protect = require('../Middleware/auth.middleware')
const commentController = require('../Controller/Comment.controller')

route.post('/add/:postId',protect,commentController.createComment)
route.patch('/updated/:commentId', protect, commentController.updateComment)
route.get('/getcomments/:postId',protect,commentController.getCommentOnPost)
route.delete('/delete/:commentId',protect, commentController.deleteComment)

module.exports = route