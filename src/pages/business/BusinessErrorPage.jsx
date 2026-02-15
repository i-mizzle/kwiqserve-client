import React from 'react'
import AppLayout from '../../components/Layouts/AppLayout'

const BusinessErrorPage = () => {
  return (
    <AppLayout>
      <div className='h-[65vh] w-full flex items-center'>
        <div className="mb-8 px-8">
          <h1 className="text-6xl font-bold text-ss-dark-blue mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-ss-dark-gray mb-2">Page Not Found</h2>
          <p className="text-ss-dark-gray mb-8">
            The business page you're looking for doesn't exist or you don't have permission to access it.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}

export default BusinessErrorPage