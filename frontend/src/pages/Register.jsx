import  react, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
 
const Register= () =>{
    const navigate = useNavigate();
const [FormData, setFormData]= useState({
    name:"",
    email:"",
    password:""
})

const [error,setError]=useState()
const [loading,setLoading]=useState(false);

 const passwordRules = {
    hasEightCharacters: FormData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(FormData.password),
    hasLowercase: /[a-z]/.test(FormData.password),
    hasNumber: /[0-9]/.test(FormData.password),
    hasSpecialCharacter: /[!@#$%^&*]/.test(FormData.password),
  };
const handleChange = (e)=>{

    setFormData({
    ...FormData  ,
    
    [e.target.name]:e.target.value,
    
    });
setError("");
};


const handleSubmit= async(e)=>{
e.preventDefault()
setError("")
try{
setLoading(true)
const response = await fetch("http://localhost:5000/api/auth/register",{
  method:"POST",

headers:{
"Content-Type":"application/json",

},
credentials:"include",
body:JSON.stringify({
    name:FormData.name.trim(),
     email: FormData.email.trim().toLowerCase(),
            password: FormData.password,

}),
})
const data = await response.json();

if(!response.ok){
    console.log(data.message)
alert(data.message || 'user  creation failed');
return;
}

alert("Account created successfully")
  navigate("/dashboard");
}catch(error){
console.error("Registration error :", error);
setError("Something went wrong Please try again");
}
finally {
      setLoading(false);
    }
};

  const ruleColor = (rulePassed) => {
    return rulePassed ? "green" : "red";
  };
return(
<div>
<div>


    <h2>Register </h2>

    <p>Create your account</p>
    </div>




    <div>
        <form onSubmit={handleSubmit }>


<div>

    <label htmlFor="name">name</label>
    <input  id="name"  
    name="name" value={FormData.name}
     onChange={handleChange} 
      placeholder="Enter your name"
       type="text" />
required
</div>

<div>
    <label htmlFor="email">email</label>
    <input id="email" 
     name="email" 
     value={FormData.email} 
     onChange={handleChange}
       placeholder="Enter your name"
         type="email"
         required />
</div>

<div>
    <label htmlFor="password">password</label>
    <input id="password"  name="password" value={FormData.password} onChange={handleChange}  placeholder="Enter your name"  type="password" autoComplete="new-password"
            minLength={8}
            required />
            <div>

                <p style={{color:ruleColor(passwordRules.hasEightCharacters)}}>At least 8 characters</p>

                <p style={{color:ruleColor(passwordRules.hasUppercase)}}>At least one uppercase letter</p>

                <p style={{color:ruleColor(passwordRules.hasLowercase)}}>At least one lowercase letter</p>

                <p style={{color:ruleColor(passwordRules.hasNumber)}}>At least one number</p>

                <p   style={{
                color: ruleColor(passwordRules.hasSpecialCharacter),
              }}
            >
              At least one special character: ! @ # $ % ^ & *</p>
            </div>

</div>

    <button type="submit" disabled={loading}>{loading ? "Creating account" :"create account"}</button>

        </form>

<p>Already have account? 
        <Link to='/login' >Login</Link>
    </p>
    </div>
</div>

)



}

export default Register;