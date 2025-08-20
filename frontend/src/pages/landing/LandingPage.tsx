import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Statistics from './components/Statistics'
import Competition from './components/Competition'
import Event from './components/Event'
import PastEvent from './components/PastEvent'
import Sponsors from './components/Sponsors'
import Footer from './components/Footer'

const LandingPage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Statistics />
        <Competition />
        <Event />
        <PastEvent />
        {/* <Sponsors /> */}
      </main>
      <Footer />
    </>
  )
}

export default LandingPage
