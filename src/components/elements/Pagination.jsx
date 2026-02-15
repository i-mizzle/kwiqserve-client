import React from 'react'

const Pagination = ({pagination, changePage, updatePerPage}) => {
    const previousPage = () => {
        if(pagination.currentPage > 1) {
            changePage(pagination.currentPage - 1)
        }
    }

    const nextPage = () => {
        let pages = Math.ceil(pagination.totalItems / pagination.perPage)
        if(pagination.currentPage < pages) {
            changePage(pagination.currentPage + 1)
        }
    }

    const changePerPage = (input) => {
        let pages = Math.ceil(pagination.totalItems / pagination.perPage)
        console.log(pages)
        updatePerPage(input)
    }

    const changeCurrentPage = (input) => {
        let pages = Math.ceil(pagination.totalItems / pagination.perPage)
        if(!input || input === 0 || input > pages) {
            return
        }
        changePage(input)
    }

    const lastPage = () => {
        changePage(Math.ceil(pagination.totalItems / pagination.perPage))
    }
    
    const firstPage = () => {
        changePage(1)
    }

    const perPageOptions = [
        25, 50, 75, 100
    ]
  return (
    <div className='w-full flex flex-row items-center justify-between py-10'>
        <div className='flex flex-row items-center gap-x-2'>
            <button onClick={()=>{firstPage()}} className='rounded bg-gray-50 bg-opacity-10 text-gray-600 text-xs py-2 px-2 transition duration-200 hover:bg-opacity-20'>
                First page
            </button>
            <button onClick={()=>{previousPage()}} className='rounded bg-gray-50 bg-opacity-10 text-gray-600 text-xs py-2 px-2 transition duration-200 hover:bg-opacity-20'>
                Previous page
            </button>
        </div>

        <div className='flex flex-row gap-x-2 items-center'>
            <p className='text-secondary text-xs'>Page</p>
            <input type='number' className='text-xs px-2 py-2 border rounded border-gray-300 w-12.5 border-opacity-20 focus:border-blue-700 bg-transparent text-primary focus:outline-none' onChange={(e)=>{changeCurrentPage(e.target.value)}} value={pagination.currentPage} /> 
            <p className='text-secondary text-xs'>of {Math.ceil(pagination.totalItems / pagination.perPage)}</p>
        </div>
        
        <div className='flex flex-row items-center gap-x-2'>
            <div className='flex flex-row gap-x-2 items-center mr-3'>
                <p className='text-secondary text-xs'>Items per page:</p>
                <select value={pagination.perPage} onChange={(e)=>{changePerPage(e.target.value)}} className='text-xs px-2 py-2 border rounded border-gray-300 border-opacity-20 w-18.75 focus:border-blue-700 bg-transparent text-primary focus:outline-none'>
                    {perPageOptions.map((option, optionIndex)=>(
                        <option key={optionIndex} value={option}>{option}</option>
                    ))}
                </select>
            </div>
            <button onClick={()=>{nextPage()}} className='rounded bg-gray-50 bg-opacity-5 text-gray-600 text-xs py-2 px-2 transition duration-200 hover:bg-opacity-20'>
                Next page
            </button>
            <button onClick={()=>{lastPage()}} className='rounded bg-gray-50 bg-opacity-5 text-gray-600 text-xs py-2 px-2 transition duration-200 hover:bg-opacity-20'>
                Last page
            </button>
        </div>
    </div>
  )
}

export default Pagination