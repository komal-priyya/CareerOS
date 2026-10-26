
import React, { useEffect, useState } from 'react'
import useLogout from '../hooks/useLogout'
import { Link } from 'react-router-dom';

const ProfileMenu = () => {
const {handleLogout,loading,error}= useLogout();
const [user,setUser]= useState(null);
const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

useEffect(()=>{
    const loadProfile= async()=>{
        try{
        const response = await fetch(`http://localhost:5000/api/auth/profile`,{
method:"GET",
credentials:"include"



        }) 

        
if(!response.ok){
     throw new Error("Failed to load profile");
}
const data= await response.json()
console.log("Profile API response:", data);
console.log("Profile photo path:", data.data?.profilePicture);

setUser(data.data)


    }catch(error){
console.error(error)
 setProfileError(error.message)
    } finally {
        setProfileLoading(false);
      }

    }

  
     loadProfile()
},[])

if (profileLoading) {
    return <p>Loading profile...</p>;
  }
  return (
    <div>
        <h2>My Profile</h2>

{/* Profile picture */}
      <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-900 flex items-center justify-center">
        {user?.profilePicture ? (
          <img
            src={`http://localhost:5000${user.profilePicture}`}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white text-4xl">
            👤
          </span>
        )}
      </div>


 
 {/* User details */}
      {user && (
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      )}



        <Link to="/profile/edit">edit profile </Link>
        {error && <p role='alert'>{error}</p>}
    

      {profileError && (
        <p role="alert">{profileError}</p>
      )}

   
        <button onClick={handleLogout} disabled={loading}>
           { loading ? "logging out" : "logout"}
        </button>

</div>

  )
}

export default ProfileMenu