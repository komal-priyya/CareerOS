
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({children}) => {

    const [loading,setLoading]=useState(true);
    const [authenticated,setauthenticated]=useState(false);

    useEffect(()=>{

    
    const checkAuth= async()=>{
        try{

            const response = await fetch(`http://localhost:5000/api/auth/profile`,{
method:"GET",
credentials:"include",

            });

            if(response.ok){
                setauthenticated(true);
            }else{
                setauthenticated(false)
            }
        }catch(error){
console.error("Authentication check failed :", error);
setauthenticated(false);
        }finally{
            setLoading(false);
        }


    }
    checkAuth()
},[]);
if(loading)
  return (


    <div>
        <p>
            checking Authentication...
        </p>
    </div>
  )
  if(!authenticated){
    return <Navigate to='/login' replace/>;
  }
  return children;
}

export default ProtectedRoute;