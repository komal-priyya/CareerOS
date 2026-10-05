const express = require('express')
const router= express.Router()

const authMiddleware= require('../middlewares/authMiddleware')


const {createTask}= require('../controllers/TaskController')
router.post('/createtask',authMiddleware,createTask)