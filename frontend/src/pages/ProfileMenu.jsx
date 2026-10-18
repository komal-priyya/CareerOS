
import React, { useEffect, useState } from 'react'
import useLogout from '../hooks/useLogout'
import { Link } from 'react-router-dom';

const ProfileMenu = () => {
const {handleLogout,loading,error}= useLogout();
const [user,setUser]= useState(null);

useEffect(()=>{
    const loadProfile= async()=>{
        try{
        const response = await fetch(`http://localhost:5000/api/auth/profile`,{
method:"GET",
credentials:"include"



        }) 

        
if(!response.ok){
console.log("failed to load profile")
}
const data= await response.json()

console.log(data.data.name)
setUser(data.data)

    }catch(error){
console.error(error)
    }

    }
     loadProfile()
},[])

  return (
    <div>
        <h2>ProfileMenu</h2>

<div>
<p>Name: {user?.name}</p>
<p>Email: {user?.email}</p>
</div>


        <button onClick={handleLogout} disabled={loading}>
           { loading ? "logging out" : "logout"}
        </button>

        <Link to="/profile/edit">edit profile </Link>
        {error && <p role='alert'>{error}</p>}
    
    </div>
  )
}

export default ProfileMenu