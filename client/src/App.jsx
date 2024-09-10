import { Routes, Route } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import DrawingCanvas from './Components/DrawingCanvas'
import DrawingList from './Components/DrawingList'
import Navbar from './Components/shared/Navbar'


function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<DrawingCanvas />}>
        </Route>
      </Routes>

      {/* <DrawingCanvas />
      <DrawingList /> */}
    </>
  )
}

export default App
