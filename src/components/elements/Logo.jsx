import React from 'react'

const Logo = ({
  size=20, // font size
  color='#030A11'
}) => {
  return (
    <div className='w-max'>
        <h1 className='font-bold' style={{color: color, fontSize: `${size}px`}}>KWIQSERVE</h1>
    </div>
  )
}

export default Logo