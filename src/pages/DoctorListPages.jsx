import DoctorList from '@/components/DoctorList'
import Footer from '../components/Footer'
import Header from '../components/Header'
import React from 'react'
import FloatingWhatsapp from '@/components/FloatingWhatsapp'

const DoctorListPages = () => {
  return (
    <>
    <Header/>
    <DoctorList/>
    <FloatingWhatsapp/>
    
    <Footer/>
    
    </>
  )
}

export default DoctorListPages