import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useState } from 'react'
import { useEffect } from 'react'

const Dashboard = () => {

  const [user,setUser]=useState("")
  const [Loading, setLoading]=useState(true);
  const[ Error,setError]= useState('')

  useEffect(()=>{
    const loadUser=async ()=>{

      try {
        const response = await fetch(`http://localhost:5000/api/auth/profile`,{
          method:"GET",
          credentials:"include"
        })

        const data = await response.json();
        if(!response.ok){
          throw new Error(data.message || "Failed to load user")
        }

setUser(data.data)



      } catch (error) {
        console.error(error)
        setError("unable to load your profile")
      }finally{
        setLoading(false)
        
      }
    }
    loadUser()
  },[])
  return (
    <div>
      <Navbar/>
      <main>
      <h2>Dashboard'</h2>

      {Loading ?(
        <p>Loading...</p>

      ): Error ? (
        <p role="alert">{Error}</p>
      ):(
        <h2>Welcome back, {user?.name}</h2>
      )}
   <p>Here's your plan for today.</p>

<Navbar/>

      </main>
    </div>



  )
}

export default Dashboard