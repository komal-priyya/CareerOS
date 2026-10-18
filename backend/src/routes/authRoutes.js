const express = require('express');
const router= express.Router();
const authMiddleware= require('../middlewares/authMiddleware.js')


const {register,login,profile,logout,editProfile} = require('../controllers/authController.js')

router.post('/register',register)
router.post('/login',login)
router.get('/profile',authMiddleware,profile)
router.post('/logout',logout)
router.patch('/profile', authMiddleware,editProfile)
module.exports= router