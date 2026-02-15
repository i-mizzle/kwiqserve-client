import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-ss-white flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-ss-dark-blue mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-ss-dark-gray mb-4">Page Not Found</h2>
          <p className="text-ss-dark-gray mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="inline-block w-full bg-ss-dark-blue text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Go to Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="inline-block w-full bg-ss-light-gray text-ss-dark-gray py-3 px-6 rounded-lg font-medium hover:bg-opacity-80 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
