import React from 'react'
import Applications from './pages/Applications'
import Dashboard from './pages/Dashboard'
import Opportunities from './pages/Opportunities'
import Task from './pages/Task'
import Today from './pages/Today'
import Sidebar from './components/Sidebar'
import {Routes,Route} from 'react-router-dom'
import Navbar from './components/Navbar'

const App = () => {
  return (

    <div>
      <Navbar/>
      <div className="layout">
        <Sidebar/>
        <main>
<Routes>
    <Route path='/applications' element={Applications}/>
    <Route path='/dashboard' element={Dashboard}/>
   <Route path='/opportunities' element={Opportunities}/>
    <Route path='/task' element={Task}/>
     <Route path='/today' element={Today}/>



   </Routes>

        </main>
      </div>
   
</div>

  )

}

export default App