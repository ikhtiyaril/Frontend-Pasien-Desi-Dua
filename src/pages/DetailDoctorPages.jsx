import DetailDoctor from '@/components/DetailDoctor'
import FloatingWhatsapp from '@/components/FloatingWhatsapp'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'
import { useParams } from 'react-router-dom'

const DetailDoctorPages = () => {
      const { id } = useParams();

  return (
    <>
    <Header/>
    <DetailDoctor id={id}/>
    <FloatingWhatsapp/>
    
    <Footer/>
    </>
  )
}

export default DetailDoctorPages