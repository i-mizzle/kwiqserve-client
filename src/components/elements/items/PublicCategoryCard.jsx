import React from 'react'

const PublicCategoryCard = ({selectCategory, category, index, activeCategory}) => {
  
  return (
    <div onClick={selectCategory} className={`relative cursor-pointer min-w-25 w-inherit shadow-lg shadow-ss-pale-blue/60 rounded p-4 xl:p-6 transition duration-200 ${activeCategory === index ? 'bg-ss-dark-blue hover:bg-ss-black' : 'bg-white hover:bg-gray-100'}`}>        
        <div className="flex flex-col justify-between gap-y-12">
          <div>
              <p className={`text-sm lg:text-medium font-medium ${index===activeCategory ? 'text-white' : 'text-gray-600'}`}>{category?.name}</p>
          </div>
        </div>
    </div>
  )
}

export default PublicCategoryCard