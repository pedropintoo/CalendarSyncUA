import { useState } from 'react'
import Navbar from './components/navbar/Navbar'
import './App.css'
import MainStructure from './components/MainStructure'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <MainStructure/>
    </>
  )
}

export default App
