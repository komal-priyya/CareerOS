const express = require('express')
const router= express.Router()

const authMiddleware= require('../middlewares/authMiddleware')


const {createTask,getAllTasks,deleteTask,updateTask}= require('../controllers/TaskController')
router.post('/create',authMiddleware,createTask)
router.get('/getallTasks',authMiddleware,getAllTasks)
router.delete('/:id',authMiddleware,deleteTask)
router.patch("/:id",authMiddleware,updateTask)
module.exports= router