import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage'
import RegistrationPage from './pages/registration/RegistrationPage'
import ConnecthRegistrationPage from './pages/registration_connecth/RegistrationPage'
import ConnecthRegistrationPageHMS from './pages/registration_connecth/RegistrationPageHMS'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/connecth" element={<ConnecthRegistrationPage />} />
        <Route path="/connecth-hms" element={<ConnecthRegistrationPageHMS />} />
      </Routes>
    </Router>
  )
}

export default App
