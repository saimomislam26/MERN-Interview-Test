import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DrawingCanvas from './Components/DrawingCanvas'
import DrawingList from './Components/DrawingList'
import Navbar from './Components/shared/Navbar'


function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<DrawingCanvas />} />
        <Route path='/show-drawings' element={<DrawingList />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
