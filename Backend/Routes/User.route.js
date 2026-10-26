const express = require('express')
const route = express.Router()
const UserController = require('../Controller/User.controller')

route.post('/create', UserController.createUser)
route.post('/login', UserController.userLogin)


module.exports = route