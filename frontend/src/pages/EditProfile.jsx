
import React, { useEffect, useState } from 'react'
import useLogout from '../hooks/useLogout'
import { Link, useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const {handleLogout,loading,error}= useLogout();
  const [Loading, setLoading] = useState(true)
  const [profileError, setProfileError] = useState("");
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    name: "",
    email: ""
  }
  )

  useEffect(() => {
    const loadProfile = async () => {
      try {
      setLoading(true)
      setProfileError("")
        const response = await fetch(`http://localhost:5000/api/auth/profile`, {
          method: "GET",
          credentials: "include"
        })
        if (!response.ok) {

          throw new Error("Failed to load profile");
        }
        const data = await response.json()

        setformData({
          name: data.data.name,
          email: data.data.email,
        })

        console.log(data.data.name)
        setUser(data.data)

      } catch (error) {
        console.error(error)
        setProfileError("failed to load the profile")
      } finally {
        setLoading(false)

      }

    }
    loadProfile()
  }, [])

  const handleChange = (e) => {


    setformData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleUpdate = async (e) => {

    e.preventDefault()
if(formData.name.trim().length<2){
  setProfileError("Name must contaon at least 2 characters")
  return;
}

      try {
        setProfileError("")
setSaving(true)
        const response = await fetch(`http://localhost:5000/api/auth/profile`, {
          method: "PATCH",


          headers: {
            "Content-Type": "application/json",

          },
          credentials: "include",
          body: JSON.stringify({
            name: formData.name.trim(),


          }),
        })

        const data = await response.json()

        if (!response.ok) {

throw new Error(data.message || "Failed to update profile")
        }

navigate("/profile")

      } catch (error) {
        console.error(error)
        setProfileError(error.message)
      }finally{
        setSaving(false)
      }


    }
  

  if(Loading){
    return <p>Loading profile..</p>
  }
  return (
    
       
    <div>

      <h2>Edit Profile</h2>
      <form onSubmit={handleUpdate}>

        <div>
          <label htmlFor="name">Name</label>
          <input type="text" placeholder='Enter your name' name='name' onChange={handleChange} value={formData.name} />
        </div>


        <div>
          <label htmlFor="email">Email</label>
          <input type="email" readOnly name='email' value={formData.email} />
        </div>
        <button type='submit'>
          {saving? "Saving" :"save changes"}</button>
      </form>

      <div>


      </div>


      <button onClick={handleLogout} disabled={loading}>
        {loading ? "logging out" : "logout"}
      </button>

      <Link to="/profile/edit">edit profile </Link>
      {profileError && <p role='alert'>{profileError}</p>}

    </div>
  )
}

export default EditProfile