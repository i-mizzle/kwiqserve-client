import React from 'react'

const Logo = ({
  size=16, // font size
  color='#030A11'
}) => {
  return (
    <div className='w-max'>
        <h1 className='font-thin tracking-[0.5em] mb-5' style={{color: color, fontSize: `${size}px`}}>SCANSERVE</h1>
    </div>
  )
}

export default Logo