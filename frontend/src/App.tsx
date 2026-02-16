import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage'
import RegistrationPage from './pages/registration/RegistrationPage'
import ConnecthRegistrationPage from './pages/registration_connecth/RegistrationPage'
import ConnecthRegistrationPageHMS from './pages/registration_connecth/RegistrationPageHMS'
// import SeminarRegistrationPage from './pages/seminar_registration/SeminarRegistrationPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/connecth" element={<ConnecthRegistrationPage />} />
        <Route path="/connecth-hms" element={<ConnecthRegistrationPageHMS />} />
        {/* <Route path="/seminar/register" element={<SeminarRegistrationPage />} /> */}
      </Routes>
    </Router>
  )
}

export default App
