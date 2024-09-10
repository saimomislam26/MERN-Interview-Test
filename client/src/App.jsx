import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DrawingCanvas from './Components/DrawingCanvas'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DrawingCanvas />
    </>
  )
}

export default App
