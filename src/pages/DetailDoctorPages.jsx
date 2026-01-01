import DetailDoctor from '@/components/DetailDoctor'
import Header from '@/components/Header'
import React from 'react'
import { useParams } from 'react-router-dom'

const DetailDoctorPages = () => {
      const { id } = useParams();

  return (
    <>
    <Header/>
    <DetailDoctor id={id}/>
    </>
  )
}

export default DetailDoctorPages