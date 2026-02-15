import TrashIcon from '../icons/TrashIcon'

const CategoryCard = ({selectCategory, category, itemsCount, index, activeCategory, deleteCategory, hideDelete}) => {
  
  return (
    <div onClick={selectCategory} className={`relative cursor-pointer w-full rounded p-6 transition duration-200 ${activeCategory === index ? 'bg-ss-dark-blue hover:bg-ss-black' : hideDelete ? 'bg-white hover:bg-opacity-80 hover:shadow-lg hover:shadow-green-500/10' : 'bg-gray-100 hover:bg-gray-200'}`}>
        {!hideDelete && <div className={`text-right `}>
          <button onClick={()=>{deleteCategory()}} className={`${activeCategory === index ? 'text-white' : 'text-gray-600'}`}>
            <TrashIcon className={`w-5 h-5`} />
          </button> 
        </div>}
        <div className="flex flex-col justify-between gap-y-12">
          <div>
              <p className={`font-medium ${index===activeCategory ? 'text-white' : 'text-gray-600'}`}>{category?.name}</p>
              {/* <p className={`capitalize font-normal text-sm ${index===activeCategory ? 'text-white' : 'text-gray-600'}`}>{category?.type}</p> */}
          </div>
            {/* <p className={`font-thin text-sm ${index===activeCategory ? 'text-white' : 'text-gray-600'}`}>0 items</p> */}
            {/* <p className={`font-thin text-sm ${index===activeCategory ? 'text-white' : 'text-gray-600'}`}>{category?.itemsCount?.toLocaleString() || 0} items</p> */}
        </div>
    </div>
  )
}

export default CategoryCard