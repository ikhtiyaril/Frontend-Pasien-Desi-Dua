import React from 'react'
import Header from '../components/Header'
import Landing from '../components/Landing'
import ArticleHome from '../components/ArticleHome'
import Footer from '@/components/Footer'
import MedicineLanding from '@/components/MedicineLanding'
import PromoCarousel from '@/components/LandingSlider'
import TestimonialCarousel from '@/components/LandingTestimoni'
import { useLocation } from 'react-router-dom'
import FloatingWhatsapp from '@/components/FloatingWhatsapp'

const HomePages = () => {
  
  return (
    <>
    <Header />
    <Landing/>
    <ArticleHome/>
    <MedicineLanding/>
    <PromoCarousel/>
    <TestimonialCarousel/>
    <FloatingWhatsapp/>
    
 <Footer/>
    </>
  )
}

export default HomePages