import React from 'react'
import ServiceList from '../components/ServiceList'
import Header from '../components/Header'
import FloatingWhatsapp from '@/components/FloatingWhatsapp'

const ListServicePages = () => {
  return (
    <>
    <Header/>
    <ServiceList/>
        <FloatingWhatsapp/>
    
    <Footer/>
    </>
  )
}

export default ListServicePages