import React from 'react'

const OrderPaymentStatus = ({status}) => {
  return (
    <>
        {status === "part-paid" &&
            <span className="px-2 py-1 rounded text-blue-600 font-medium bg-blue-400/10 text-xs">
                {/* <Circle width={15} /> */}
                Part paid
            </span>
        }
        {status === "paid" &&
            <span className="px-2 py-1 rounded text-green-600 font-medium bg-green-400/10 block text-xs">
                {/* <CheckIcon /> */}
                Paid in full
            </span>
        }
        {status === "unpaid" &&
            <span className="px-2 py-1 rounded text-red-600 bg-red-400/10 block text-xs">
                {/* <CloseIcon width={22} /> */}
                Unpaid
            </span>
        }
    </>
  )
}

export default OrderPaymentStatus