import React from 'react'

const Tasks = () => {
 const [FormData,setFormData] = useState({
  title:"",
  description:"",
  status:"pending",
  priority:"medium",
 });
  const handleChange = async (e)=>{
    setFormData({
      ...FormData,
    [e.target.name]:[e.target.value]
    })
  }

  const handleSubmit= async(e)=>{
    e.preventDefault();
  

  try {
    const response = await fetch("http://localhost:5000/api/tasks/create",{
      method:"POST",

      headers:{
"Content-Type":"application/json",
      },
      credentials:"include",
      body:JSON.stringify(FormData),
    });
    const data = await response.json();

    if(!response.ok){
      alert(data.message || 'Task creation failed');
      return;
    }

    alert("Task created successfully")

      console.log("Created task:", data);
  } catch (error) {
     console.error(error);
      alert("Something went wrong");
    
  }
}
  return (

    <div>
<h2>Create Task</h2>

<form onSubmit={handleSubmit}>
<div>

<label htmlFor='title' >Title</label>
<input id="title"  name="title" placeholder='Enter Task title' value={FormData.title} onChange={handleChange} required/>


</div>

<br/>

<div>


  <label htmlFor='description'>description</label>

  <input id="description" name="description" placeholder="Enter task decsription" type="text"  value={FormData.description} onchange={handlechange}/>
</div>


<div>

  <label htmlFor="status">status</label>
  <select id="status" name="status" value={FormData.status}  onchange={handleChange}>

    <option value="pending">Pending</option>
    <option value="completed">Completed</option>
    <option value="In-progress">In-Progress</option>
    <option value="cancelled">Cancelled</option>
  </select>
</div>


<br />
<div>

  <label htmlFor="priority">priority</label>
  <select id="status" name="status" value={FormData.priority}  onchange={handleChange}>

    <option value="low">low</option>
    <option value="medium">medium</option>
    <option value="high">high</option>
  </select>
</div>


<button type="submit">Add Task</button>
</form>
    </div>

   

  )
}




export default Tasks
