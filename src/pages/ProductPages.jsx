import React from 'react'
import Header from '../components/Header'
import ProductListing from '../components/ProductListing'
import ProductListingMobile from '@/components/ProductListingMobile'
import Footer from '@/components/Footer'
import FloatingWhatsapp from '@/components/FloatingWhatsapp'

const ProductPages = () => {
  return (
    <>
    <Header/>
    <div className='hidden md:block'><ProductListing/></div>
    <div className='block md:hidden'><ProductListingMobile/></div>
        <FloatingWhatsapp/>
    
<Footer/>
    
    </>
  )
}

export default ProductPages