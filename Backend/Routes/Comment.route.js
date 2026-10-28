const express = require('express')
const route = express.Router()
const protect = require('../Middleware/auth.middleware')
const commentController = require('../Controller/Comment.controller')

route.post('/add/:id',protect,commentController.createComment)

module.exports = route