import React from 'react'

const Currency = ({amount, vat}) => {
  return (
    <div className='flex gap-x-1'>
      <span className='text-xs mt-1'>₦</span>
      <h3 className='text-lg font-medium font-space-grotesk text-gray-800'>{(amount)?.toLocaleString()}</h3>
      {vat && vat > 0 && <span className='text-[12px] font-thin'>({(vat)?.toLocaleString()} vat)</span>}
    </div>
  )
}

export default Currency