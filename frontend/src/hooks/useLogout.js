import { useState } from "react";
import { useNavigate } from "react-router-dom";


function useLogout (){

    const[loading, setLoading]=useState(false);
    const [ error,setError]= useState("")
const navigate = useNavigate()
const  handleLogout = async()=>{

setLoading(true)
setError("")
try{
    const response= await fetch(`http://localhost:5000/api/auth/logout`,{
        method: "POST",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("logout failed")

    }

navigate("/login" ,{replace:true})
}
catch(error){
    console.log(error)
    setError("Something went wrong", error)


}
finally{
    setLoading(false)
}



}
return {handleLogout,loading,error}
}
export default useLogout;