const jwt = require('jsonwebtoken')



const generateTokenAndsetCookie = async (user,res)=>{

    const token= jwt.sign(
{id:user._id},
process.env.JWT_SECRET_KEY,
{expiresIn:"1d"}
    )
    res.cookie("token",token,{
 httpOnly: true,
            secure:false,
            sameSite:"lax",
            maxAge:7*24*60*60*60*10000
    })
}
module.exports= generateTokenAndsetCookie;