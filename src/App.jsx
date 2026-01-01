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
import ProductPages from './pages/ProductPages'
import ProductDetailPages from './pages/ProductDetailPages'
import CartPages from './pages/CartPages'
import CheckoutPages from './pages/CheckoutPages'
import ArticlePages from './pages/ArticlePages'
import ArticleDetailPages from './pages/ArticleDetailPages'
import DashboardPasienPages from './pages/DashboardPasienPages'
import VideoCallPages from './pages/VideoCallPages'
import DoctorList from './components/DoctorList'
import DetailDoctorPages from './pages/DetailDoctorPages'
import AboutUsPages from './pages/AboutUsPages'
import ServicesPages from './pages/ServicesPages'
import ContactPages from './pages/ContactPages'
import DoctorListPages from './pages/DoctorListPages'

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
        <Route path="/medicine" element={<ProductPages/>}/>
        <Route path="/medicine/detail" element={<ProductDetailPages/>}/>
        <Route path="/cart" element={<CartPages/>}/>
        <Route path="/checkout" element={<CheckoutPages/>}/>
        <Route path="/article" element={<ArticlePages/>}/>
        <Route path="/article/:slug" element={<ArticleDetailPages/>}/>
        <Route path="/dashboard" element={<DashboardPasienPages/>}/>
        <Route path="/video-call" element={<VideoCallPages/>}/>
        <Route path="/we-doctor" element={<DoctorListPages/>}/>
        <Route path="/doctor/:id" element={<DetailDoctorPages/>}/>
        <Route path="/about-us" element={<AboutUsPages/>}/>
        <Route path="/layanan" element={<ServicesPages/>}/>
        <Route path="/contact" element={<ContactPages/>}/>








        
        
      </Routes>
     </Router>
    </>
  )
}

export default App
