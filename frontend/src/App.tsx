import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage'
import RegistrationPage from './pages/registration/RegistrationPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
      </Routes>
    </Router>
  )
}

export default App
