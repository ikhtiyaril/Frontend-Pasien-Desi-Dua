import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePages from './pages/HomePages'
import LoginPages from './pages/LoginPages'
import RegisterPages from './pages/RegisterPages'
import RecoveryPages from './pages/RecoveryPages'
import RecoveryOTPPages from './pages/RecoveryOTPPages'
import RecoveryDonePages from './pages/RecoveryDonePages'
import ListServicePages from './pages/ListServicePages'
import BookingServicePages from './pages/BookingServicePages'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<HomePages/>}/>
        <Route path="/login" element={<LoginPages/>}/>
        <Route path="/register" element={<RegisterPages/>}/>
        <Route path="/recovery" element={<RecoveryPages/>}/>
        <Route path="/recovery/OTP" element={<RecoveryOTPPages/>}/>
        <Route path="/recovery/done" element={<RecoveryDonePages/>}/>
        <Route path="/service" element={<ListServicePages/>}/>
        <Route path="/booking" element={<BookingServicePages/>}/>
        
      </Routes>
     </Router>
    </>
  )
}

export default App
