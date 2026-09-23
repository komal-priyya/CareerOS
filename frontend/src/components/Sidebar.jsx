import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className=''>

        <Link to='/applications'>Applications</Link>
        <Link to='/dashboard'>Dashboard</Link>
        <Link to='/opportunities'>Opportunities</Link>
        <Link to='/task'>Task</Link>
        <Link to ='/today'>Today</Link>
    </div>
  )
}

export default Sidebar