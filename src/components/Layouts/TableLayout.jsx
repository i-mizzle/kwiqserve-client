import React from 'react'
import TableHeader from '../partials/TableHeader'
import TableFooter from '../partials/TableFooter'

const TableLayout = ({children}) => {
  return (
    <>
        <TableHeader />
        <main className='min-h-screen h-inherit pt-20 bg-gray-50 pb-15'>
            {children}
        </main>
        <TableFooter />
    </>
  )
}

export default TableLayout