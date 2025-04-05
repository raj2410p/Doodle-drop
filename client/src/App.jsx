import { HomePage } from './Components/HomePage'
import { LoginPage } from './Components/LoginPage'
import {Admin} from './Components/dashboard/Admin'
import {Customer}from './Components/dashboard/Customer'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <main>
          <Routes>
            {/* Add more neccesary  Routes*/}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/Customer" element={<Customer />} />
           
          </Routes>
        </main>
      </BrowserRouter>
    </>
  )
}

export default App
