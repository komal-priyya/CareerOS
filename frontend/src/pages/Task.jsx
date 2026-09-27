import { useState } from "react";

function AddTask(){
  const [title,setTitle]= useState(""); 
  const [priority,setpriority]= useState("medium");

const handleSubmit= async(e)=>{
  e.preventDefault();

const response =  await fetch("http://localhost:5000/api/tasks",{
  method: "POST",
  headers:{
    "Content-Type":"application/json",

  },
   body:JSON.stringify({
    title:title,
    priority:priority,
  }),
});
// const data = await response.json();
// console.log(data);

const text = await response.text();

console.log("STATUS:", response.status);
console.log("RESPONSE:", text);
}
  return(
    <form onSubmit={handleSubmit}>
      <input type ="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder='Ente Task'/>

      <select value={priority} onChange={(e)=> setpriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit">Add Task</button>




    </form>
  )
}
export default AddTask


