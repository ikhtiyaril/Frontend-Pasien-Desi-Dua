import React from 'react'
import Header from '../components/Header'
import ArticleList from '../components/ArticleList'
import Footer from '@/components/Footer'
import FloatingWhatsapp from '@/components/FloatingWhatsapp'

const ArticlePages = () => {
  return (
    <>
    <Header/>
    <ArticleList/>
        <FloatingWhatsapp/>
    
    <Footer/>
    </>
  )
}

export default ArticlePages