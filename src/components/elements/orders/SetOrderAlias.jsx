import React, { useState } from 'react'
import TextField from '../form/TextField'

const SetOrderAlias = ({tempOrderAlias, cancel, parkOrder}) => {
    const [alias, setAlias] = useState(tempOrderAlias);
    return (
        <>
            <div className='w-full'>
                <TextField
                    inputType="text" 
                    fieldId="order-alias"
                    inputLabel="Order Alias" 
                    preloadValue={alias || ''}
                    hasError={false} 
                    returnFieldValue={(value)=>{setAlias(value)}}
                />
            </div>

            <div className="mt-8 flex flex-row-reverse gap-x-4">
                <button
                    type="button"
                    className="inline-flex justify-center px-4 py-3 text-xs font-medium bg-green-600 text-white border border-transparent rounded hover:bg-green-800 focus:outline-none"
                    onClick={()=>{parkOrder(alias)}}
                >
                    Park Order
                </button>

                <button
                    type="button"
                    className="inline-flex justify-center px-4 py-3 text-xs font-medium bg-transparent border border-transparent rounded hover:bg-opacity-50 hover:bg-mms-red hover:text-white focus:outline-none"
                    onClick={cancel}
                >
                    Close
                </button>
                
            </div>
        </>
    )
}

export default SetOrderAlias