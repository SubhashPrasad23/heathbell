import React from 'react'
import logo from "../assets/logo.png"
const Header = () => { 
  return (
    <div className='w-full bg-teal-600 py-3 px-4 '>
      <img src={logo} className='h-7 w-25'/>
    </div>
  )
}

export default Header
