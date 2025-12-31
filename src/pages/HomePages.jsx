import React from 'react'
import Header from '../components/Header'
import Landing from '../components/Landing'
import ArticleHome from '../components/ArticleHome'
import Footer from '@/components/Footer'
import MedicineLanding from '@/components/MedicineLanding'
import PromoCarousel from '@/components/LandingSlider'
import TestimonialCarousel from '@/components/LandingTestimoni'
import { useLocation } from 'react-router-dom'

const HomePages = () => {
  
  return (
    <>
    <Header />
    <Landing/>
    <ArticleHome/>
    <MedicineLanding/>
    <PromoCarousel/>
    <TestimonialCarousel/>
    
 <Footer/>
    </>
  )
}

export default HomePages