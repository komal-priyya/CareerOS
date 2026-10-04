const jwt= require("jsonwebtoken")
const User = require('../models/UserModel')


const protectRoute=  async(req,res,next)=>{
try{
    const token = req.cookies.token

    if(!token){
    return res.status(401).json({
        success:false,
        message:" Unauthorized. Please Login first"
    })
}


const decoded =  jwt.verify(token,process.env.JWT_SECRET_KEY) 
const user = await User.findById(decoded.id)

if(!user){
    return res.status(404).json({
        success:false,
        message:"User not found"
    })
}
req.user = user
next()}
catch(error){
    console.error(error)
    return res.status(401).json({
        sucsess:false,
        message:"Invalid or Expired Token"
    })
}
}
module.exports= protectRoute