const express = require('express')
const route = express.Router()
const upload = require('../Middleware/upload.middleware')
const protect = require('../Middleware/auth.middleware')
const UserController = require('../Controller/User.controller')

route.post('/create', UserController.createUser)
route.post('/login', UserController.userLogin)
route.get('/search', protect, UserController.searchUsers)
route.get('/:userId', protect, UserController.getUserById)
route.patch('/updateprofilepic', protect, upload.single("profilePicture"), UserController.updateProfilePicture)
route.put('/update', protect, UserController.updateUser)
route.patch('/changepassword',protect,UserController.changePassword)

module.exports = route