import React from 'react'

const Status = ({status}) => {
  return (
    <div className={`rounded text-xs flex items-center gap-x-[5px] p-[5px] border border-gray-100 capitalize font-space-grotesk font-[500]
        ${status === 'published' || status === 'subscribed' ? 'bg-green-50 text-green-600' : ''}
        ${status === 'draft' || status === 'unsubscribed' ? 'bg-gray-50 text-gray-600': ''}
    `}>
        {status}
    </div>
  )
}

export default Status