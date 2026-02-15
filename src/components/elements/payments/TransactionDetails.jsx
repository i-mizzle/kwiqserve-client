import React from 'react'

const TransactionDetails = ({transaction, closeTransaction}) => {
  return (
    <>
        <div className="mt-2">
            <div className='w-full flex flex-row justify-between py-3 border-b border-secondary'>
                <div className="w-1/2">
                    <label className='text-xs block mb-3 text-opacity-40'>Reference</label>
                    <p className="text-xs font-medium">
                        {transaction?.transactionReference}
                    </p>
                </div>
                <div className="w-1/2"> 
                    <label className='text-xs block mb-2 text-opacity-40'>Status</label>
                    <div className='flex flex-row items-center gap-x-2'>
                        {transaction?.status === "PENDING" &&
                            <span className="p-2 rounded text-yellow-400 bg-yellow-400 bg-opacity-30">
                                {/* <Circle width={15} /> */}
                            </span>
                        }
                        {transaction?.status === "SUCCESSFUL" &&
                            <span className="p-1 rounded text-green-400 bg-green-400 bg-opacity-30 block">
                                {/* <CheckIcon /> */}
                            </span>
                        }
                        {transaction?.status === "FAILED" &&
                            <span className="p-1 rounded text-red-400 bg-red-400 bg-opacity-30 block">
                                {/* <CloseIcon width={22} /> */}
                            </span>
                        }
                        {transaction?.status === "ROLLED_BACK" &&
                            <span className="p-1 rounded text-gray-400 bg-gray-400 bg-opacity-30 block">
                                {/* <BackIcon classes='w-6' /> */}
                            </span>
                        }
                        <p className="text-xs font-medium">{transaction?.status}</p>
                    </div>
                </div>
            </div>

            <div className='w-full flex flex-row py-3 border-b border-secondary'>
                <div className="w-1/2">
                    <label className='text-xs block mb-3 text-opacity-40'>Time stamp</label>
                    <p className="text-xs font-medium">
                    {new Date(transaction?.createdAt).toDateString()} - {new Date(transaction?.updatedAt).toLocaleTimeString()}
                    </p>
                </div>
                <div className="w-1/2">
                    <label className='text-xs block mb-2 text-opacity-40'>Amount</label>
                    <p className="text-xs font-medium text-md text-green-600">N {transaction?.amount ? transaction?.amount.toLocaleString() : 0 }</p>
                </div>
            </div>

            <div className='w-full flex flex-row border-b border-secondary py-3'>
                <div className="w-1/2">
                    <label className='text-xs block mb-3 text-opacity-40'>Channel</label>
                    <p className="text-xs font-medium">
                        {transaction?.channel}
                    </p>
                </div>
                {/* <div className="w-1/2">
                    <label className='text-xs block mb-2 text-opacity-40'>Payment Source</label>
                    <p className="text-xs">{transaction?.source}</p>
                </div> */}
            </div>

            {transaction?.receivingChannel && <div className='w-full'>
                <label className='text-xs block pb-4 pt-3 text-opacity-40'>Received via</label>
                {transaction?.channel === 'transfer' && 
                    <div className={`p-3 border rounded my-2 text-left w-full block border-nadabake-purple`}>
                        <p className='font-medium text-md text-nadabake-purple'>{transaction?.receivingChannel?.accountName}</p>
                        <p className="text-sm text-gray-600">{transaction?.receivingChannel?.bank} - {transaction?.receivingChannel?.accountNumber}<br /><span className="text-xs text-gray-400">{transaction?.receivingChannel?.description}</span></p>
                    </div>
                }
                {transaction?.channel === 'pos' && 
                    <div className={`p-3 border rounded my-2 text-left w-full block border-nadabake-purple`}>
                        <p className='font-medium text-md text-nadabake-purple'>{transaction?.receivingChannel?.deviceName}</p>
                        <p className="text-sm text-gray-600">{transaction?.receivingChannel?.provider} - {transaction?.receivingChannel?.serialNumber}</p>
                    </div>
                }
            </div>}

            {/* <div className='w-full border-b border-secondary py-3'>
                <label className='text-xs block mb-3 text-opacity-40'>Transaction initiated by</label>
                <div className="w-full flex flex-row items-center gap-3">
                    <div className="p-2 rounded-md bg-secondary text-gray-500 border border-primary shadow-md inline-block">
                        <UserIcon  className="w-10 h-10"/>
                    </div>
                    <div>
                        <p className="text-sm mb-2 font-bold">John Doe</p>
                        <p className="text-xs font-medium">johndoe@yahoo.com, +234 801 234 5678</p>
                    </div>
                </div>
            </div> */}
        </div>

        <div className="mt-8 flex flex-row-reverse gap-x-4">
            <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-xs font-medium bg-transparent border border-transparent rounded-md hover:bg-opacity-50 hover:bg-mms-red hover:text-white focus:outline-none"
                onClick={closeTransaction}
            >
                Close
            </button>
            {/* {transaction?.status !== "ROLLED_BACK" && <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-xs font-medium bg-transparent border border-transparent rounded-md hover:bg-gray-200 focus:outline-none"
                onClick={closeTransaction}
            >
                Roll Back transaction
            </button>} */}
        </div>
    </>
  )
}

export default TransactionDetails