
import React, { useEffect, useState } from 'react'
import useLogout from '../hooks/useLogout'
import { Link, useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { handleLogout, loading, error } = useLogout();
  const [Loading, setLoading] = useState(true)
  const [profileError, setProfileError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null)
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    name: "",
    email: ""
  }
  )
  const [selectedPhoto, setselectedPhoto] = useState(null)

// select a photo
  const handlePhotoChange = (e) => {

    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      setProfileError("Only JPG, PNG and WebP images are allowed")
      e.targer.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setProfileError("Image must be 2MB or smaller");
      e.target.value = "";
      return
    }
    setselectedPhoto(file)
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setProfileError("");

  }



  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)

        const response = await fetch(`http://localhost:5000/api/auth/profile`, {
          method: "GET",
          credentials: "include"
        })
        const data = await response.json()
        if (!response.ok) {

          throw new Error("Failed to load profile");
        }


        setformData({
          name: data.data.name,
          email: data.data.email,
        })

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

  // Release temporary preview URLS
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // upload selected photo
  const handlePhotoUpload = async () => {
    if (!selectedPhoto) {
      setProfileError("Please select a photo first");
      return;
    }

    try {
      setUploading(true);
      setProfileError("");

      const photoData = new FormData();
      photoData.append("profilePhoto", selectedPhoto);

      const response = await fetch(
        "http://localhost:5000/api/auth/profile/photo",
        {
          method: "PATCH",
          credentials: "include",
          body: photoData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Photo upload failed");
      }

      setUser((prev) => ({
        ...prev,
        ...data.data
      }));

      setselectedPhoto(null);
      setPreviewUrl(null);

    } catch (err) {
      console.error(err);
      setProfileError(err.message);
    } finally {
      setUploading(false);
    }
  };





  const handleChange = (e) => {


    setformData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  // save updated name
  const handleUpdate = async (e) => {

    e.preventDefault()
    if (formData.name.trim().length < 2) {
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
    } finally {
      setSaving(false)
    }


  }


  if (Loading) {
    return <p>Loading profile..</p>
  }
  return (


    <div>

      <h2>Edit Profile</h2>

      {/* <div>
          {previewUrl && (
  <img src={previewUrl} alt="Profile preview" />
)}
        <input
        hidden
        id="profilePhoto"
  type="file"
  accept="image/*"
  onChange={handlePhotoChange}
/>
<label    htmlFor="profilePhoto"      className="w-28 h-28 rounded-full bg-gray-900 flex items-center justify-center cursor-pointer overflow-hidden hover:bg-gray-800 transition-colors"
>
  📷
</label>
    </div> */}

      <div className="flex flex-col items-center gap-3">
        <input
          type="file"
          id="profilePhoto"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
          className="hidden"
        />

        <label
          htmlFor="profilePhoto"
          className="w-28 h-28 rounded-full bg-gray-900 flex items-center justify-center cursor-pointer overflow-hidden hover:bg-gray-800 transition-colors"
        >
          {previewUrl ||user?.profilePicture ? (
            <img
              src={previewUrl ||   `http://localhost:5000${user.profilePicture}`}
              alt="Profile "
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-4xl">📷</span>
          )}
        </label>

        <p className="text-gray-400 text-sm">Choose Photo</p>


        <button
          type="button"
          onClick={handlePhotoUpload}
          disabled={!selectedPhoto || uploading}
        >
          {uploading ? "Uploading..." : "Upload Photo"}
        </button>
      </div>

         {/* Existing name update form */}
      <form onSubmit={handleUpdate}>

        <div>
          <label htmlFor="name">Name</label>
          <input type="text" placeholder='Enter your name' name='name' onChange={handleChange} value={formData.name} />
        </div>


        <div>
          <label htmlFor="email">Email</label>
          <input type="email" readOnly name='email' value={formData.email} />
        </div>
        <button type='submit' disabled={saving}>
          {saving ? "Saving" : "save changes"}</button>
      </form>
 {profileError && (
        <p role="alert">{profileError}</p>
      )}
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