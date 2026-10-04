const express = require('express');
const router= express.Router();
const authMiddleware= require('../middlewares/authMiddleware.js')


const {register,login,profile} = require('../controllers/authController.js')

router.post('/register',register)
router.post('/login',login)
router.get('/profile',authMiddleware,profile)
module.exports= router