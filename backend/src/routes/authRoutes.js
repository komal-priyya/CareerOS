const express = require('express');
const router= express.Router();
const authMiddleware= require('../middlewares/authMiddleware.js')
const upload= require ('../middlewares/uploadMiddleware.js')



const {register,login,profile,logout,editProfile,uploadProfilePhoto} = require('../controllers/authController.js')

router.post('/register',register)
router.post('/login',login)
router.get('/profile',authMiddleware,profile)
router.post('/logout',logout)
router.patch('/profile', authMiddleware,editProfile)
router.patch("/profile/photo",authMiddleware,upload.single("profilePhoto"),uploadProfilePhoto);
module.exports= router