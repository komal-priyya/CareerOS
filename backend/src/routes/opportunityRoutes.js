const express =require( "express");
const { getOpportunities ,createOpportunity,getMyOpportunities} =require ("../controllers/opportunityController.js");
const authMiddleware= require("../middlewares/authMiddleware")


const router = express.Router();

router.get("/",authMiddleware, getOpportunities);
router.post("/create",authMiddleware,createOpportunity)
router.get("/mine", authMiddleware, getMyOpportunities);
module.exports=router;