import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login =  () => {
    const navigate= useNavigate()

const [FormData,setFormData]= useState({
    email:"",
    password:""
})
    const [loading,setLoading]=useState()
    const [error,setError]=useState('')


const handleChange = (e)=>{
    setFormData({
        ...FormData,
        [e.target.name]:e.target.value

    })
}
    const handleSubmit = async(e)=>{
        e.preventDefault()
try{
    setLoading(true)
        const response = await fetch(`http://localhost:5000/api/auth/login`,{

            method:"POST",
headers:{
    "Content-Type":"application/json"
},

credentials:"include",
body:JSON.stringify({
    email:FormData.email.trim().toLowerCase(),
    password:FormData.password
})

        })
 const data =  await response.json()

 if(!response.ok){

    alert(data.message || "user login failed");
    return
 }

 alert("login successfully")
  navigate("/dashboard", { replace: true });

}
    catch(error){
console.error("Registration error: "+ error);
setError("Something went wrong Please try again")
    }finally{
setLoading(false)
    }
}
  return (
    <div>
        
        <div>
  <h2> Login</h2>


<form onSubmit={handleSubmit}>

        

          <div>

            <label htmlFor="email">email</label>
            <input type="email" name='email' id ='email' placeholder='Enter your email' onChange={handleChange} />

          </div>
          <div>
            
            <label htmlFor="password">password</label>
            <input type="password" name='password' id ='password' placeholder='Enter your password' onChange={handleChange} />

          </div>

<button type ="submit" disabled={loading}>{loading ? "logging In  " : "Login "}</button>

</form>
    <p>Don't have account? 
        <Link to='/register' >Create</Link>
    </p>
        </div>
        
        
       </div>
  )

}
export default Login