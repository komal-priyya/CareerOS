import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useLogout from '../hooks/useLogout'
import ProfileMenu from '../pages/ProfileMenu'
const Navbar = () => {
  const [isopen, setIsopen]= useState(false)
const{handleLogout,loading,error}= useLogout()
const navigate = useNavigate()
const handleProfileClick = ()=>{
  setIsopen(prev=>!prev);
}
const navigateToProfile =()=>{
navigate("/profile")
}


const handleDropdown=()=>{
  setIsopen(false)
}
  return (
    <div>



      <div>

        <h2>
          CareerOS

        </h2>

      </div>
      <div>
       <button onClick={handleProfileClick}>Avatar</button>
     { isopen && (
      <div>
      <Link to = "/profile" onClick={handleDropdown} >profile </Link>
      
        <button onClick={handleLogout} disabled={loading}>
          { loading ? "logging out" : "logout"}
        </button>
      
</div>
     )
    }
        </div>
     </div>
    // </div>
  )
}

export default Navbar