import BookingDokterOnly from '@/components/BookingDoctorOnly'
import BookingDoctorOnlyMobile from '@/components/BookingDoctorOnlyMobile'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'

const BookingDoctorOnlyPages = () => {
  return (
<>
<Header/>
<div className="hidden md:block"><BookingDokterOnly/></div>
<div className="block md:hidden"><BookingDoctorOnlyMobile /></div>

<Footer/>
</>   
  )
}

export default BookingDoctorOnlyPages