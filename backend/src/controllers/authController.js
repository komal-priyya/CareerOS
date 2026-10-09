const express = require('express')
const User = require('../models/UserModel')
const bcrypt= require('bcrypt')
const generateToken = require('../utils/generateToken')

// validate password
    const validatePassword = (password) =>{
        if(typeof password !== "string"){
            return "Password must be text";
        }
        if(password.length <8){
             return "Password must contain at least 8 characters";
        }
        if(Buffer.byteLength(password,"utf8")>72)
{
     return "Password must not exceed 72 bytes";
}   

if(!/[A-Z]/.test(password)){
    return "Password must contain at least one uppercase letter"
}
if(!/[a-z]/.test(password)){
    return  "Password must contain at least one lowercase letter"
}
if(!/[0-9]/.test(password)){
return "Password must contain at least one number"
}
if(!/[!@#$%^&*]/.test(password)){
 return    "Password must contain at least one special character"

}
return null;
    }
// Register----

const register =  async (req,res)=>{
try{

    const { name,email,password} = req.body

    if(!name || !email || !password){
        return res.status(400).json({
            success:false,
            message: "All fields are required"
        })
    }

    const normalizedEmail= email.trim().toLowerCase();

    const passwordError =validatePassword(password);

     if(passwordError){
        return res.status(400).json({
            success:false,
            message:passwordError
        })
    }
    const userExists= await User.findOne({email:normalizedEmail})
    if(userExists){
        return res.status(409).json({
            success:false,
            message:"User already Exists"
        });
    }

    const hashedpassword= await bcrypt.hash(password,10)
    const user = await User.create({
        name:name.trim(),
        email:normalizedEmail,
        password:hashedpassword,
    });
    generateToken(user,res);
  

    return res.status(201).json({
        success:true,
        message: "User created",
          data:{
            id: user._id,
        name: user.name,
        email: user.email   
        }
    })


}catch(error){
     console.error(error)
   return res.status(500).json({
   
    success:false,
    message:"User could not be created"
   }) ;
}}



//Login


const  login = async(req,res)=>{
    console.log("Login controller reached")

    try {


        const { email,password}= req.body;

        if(!email && !password){
            return res.status(400).json({
                success:false,
                message:"All Fields are required"
            })
        }
            const user= await User.findOne({email});
            if(!user){
                return res.status(400).json({
                    success:false,
                    message:"user not found"
                })
            }

           const isMatch= await bcrypt.compare(password,user.password)
      if(!isMatch){
    return res.status(400).json({
     success:false,
    message:"Invalid email or password"
   })
   }

 generateToken(user,res)
 return res.status(200).json({
    success:true,
    message:"Login successfull"
 })

        }
     catch (error) {
        console.error(error)
        return res.status(400).json({
            success:false,
            message:error.message
                })
    }
}
const profile = async(req,res)=>{
try {
    const user=req.user

  
    return res.status(200).json({
        success:true,
        data:{
            id:req.user._id,
            name:req.user.name,
            email:req.user.email
        }

          
    })
} catch (error) {
   console.error(error) 
     return res.status(400).json({
            success:false,
            message:error.message
                })
}
}
module.exports= {register,login,profile}