import React from 'react'
import Applications from './pages/Applications'
import Dashboard from './pages/Dashboard'
import Opportunities from './pages/Opportunities'
// import AddTask from './pages/Task'
import Today from './pages/Today'
import Sidebar from './components/Sidebar'
import {Routes,Route, useNavigate} from 'react-router-dom'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import Login from './pages/Login'
import GuestRoute from './components/GuestRoute'
import ProtectedRoute from './components/ProtectedRoute'
import ProfileMenu from './pages/ProfileMenu'
import EditProfile from './pages/EditProfile'
import MainLayout from './layouts/Layout'
import Tasks from './pages/Tasks'

const App = () => {
  return (

    <div>
      {/* <Navbar/> */}
      <div className="layout">
        {/* <Sidebar/> */}

        <main>
<Routes>

  <Route path ='/' element={
    <GuestRoute>
       <Login/>
    </GuestRoute>}
   />

  <Route path ='/register' element={
    <GuestRoute>
       <Register/>
    </GuestRoute>
   
    }/>
    <Route path ='/login' element={
      <GuestRoute>
        <Login/> 
      </GuestRoute>
     
      }/>
{/* 
    <Route path='/applications' element=
    {
     <ProtectedRoute>
      < Applications/>
     </ProtectedRoute>
    }/> */}

    
      <Route element={<MainLayout />}>

      <Route path='/dashboard' element={
      
      <ProtectedRoute>
        < Dashboard/>
      </ProtectedRoute>
     
    
    }/>
   <Route path='/profile' element={
    <ProtectedRoute>
    <ProfileMenu/>

    </ProtectedRoute>
   }
    />
    {/* <Route path='/tasks' element={<AddTask/>}/> */}
     <Route path='/today' element={
      <ProtectedRoute>
  <Today/>
      </ProtectedRoute>
     }/>
     
     <Route path='/tasks' element={
      <ProtectedRoute>
  <Tasks/>
      </ProtectedRoute>
     }/>
     <Route path='/profile/edit' element={
      <ProtectedRoute>
  <EditProfile/>
      </ProtectedRoute>
     }/>
     </Route>
</Routes>
        </main>
      </div>
   
</div>
  )
}
export default App

