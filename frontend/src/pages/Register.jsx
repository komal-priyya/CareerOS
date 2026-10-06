import  react, { useState } from 'react';


const Register= () =>{
const [FormData, setFormData]= useState({
    name:"",
    email:"",
    password:""
})

const handleChange = (e)=>{

    setFormData({
    ...FormData  ,
    
    [e.target.name]:[e.target.value]
    })
}


const handleSubmit= async(e)=>{
e.preventDefault()
try{
const response = await fetch("http://localhost:5000/api/auth/register",{
  method:"POST",

headers:{
"Content-Type":"application/json",

},
credentials:"include",
body:JSON.stringify(FormData),

});
const data = await response.json();

if(!response.ok){
    console.log(data.message)
alert(data.message || 'user  creation failed');
return;
}

alert("Task created successfully")

}catch(error){
console.error(error);
alert("something went wrong");
}
}

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
    <input  id="name"  name="name" value={FormData.name} onChange={handleChange}  placeholder="Enter your name" type="text" />

</div>

<div>
    <label htmlFor="email">email</label>
    <input id="email"  name="email" value={FormData.email} onChange={handleChange}  placeholder="Enter your name"  type="text" />
</div>

<div>
    <label htmlFor="password">password</label>
    <input id="password"  name="password" value={FormData.password} onChange={handleChange}  placeholder="Enter your name"  type="text" />
</div>

    <button type="submit">SignIn</button>

        </form>

    </div>
</div>

)



}

export default Register;