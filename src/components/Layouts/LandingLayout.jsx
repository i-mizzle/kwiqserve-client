import React from 'react'
import LandingHeader from '../partials/LandingHeader'

const LandingLayout = ({children}) => {
  return (
    <>
      <LandingHeader />
      <main className='w-full'>
        {children}
      </main>
    </>
  )
}

export default LandingLayout