import React from 'react'

const OrderStatus = ({status}) => {
  return (
    <>
        {status === "PENDING" &&
            <span className="px-2 py-1 rounded text-gray-600 font-medium bg-gray-400/10 text-xs">
                {/* <Circle width={15} /> */}
                Pending
            </span>
        }
        {status === "IN_PROGRESS" &&
            <span className="px-2 py-1 rounded text-blue-600 font-medium bg-blue-400/10 text-xs">
                {/* <Circle width={15} /> */}
                In progress
            </span>
        }
        {status === "PREPARING_ORDER" &&
            <span className="px-2 py-1 rounded text-yellow-800 font-medium bg-yellow-400/10 text-xs">
                {/* <Circle width={15} /> */}
                Preparing order
            </span>
        }
        {status === "pending" &&
            <span className="px-2 py-1 rounded text-yellow-800 font-medium bg-yellow-400/10 text-xs">
                {/* <Circle width={15} /> */}
                Pending
            </span>
        }
        {status === "OUT_FOR_DELIVERY" &&
            <span className="px-2 py-1 rounded text-green-800 font-medium bg-green-200/40 block text-xs">
                {/* <CheckIcon /> */}
                Out for delivery
            </span>
        }
        {status === "DELIVERED" &&
            <span className="px-2 py-1 rounded text-green-600 font-medium bg-green-400/10 block text-xs">
                {/* <CheckIcon /> */}
                Delivered
            </span>
        }
        {status === "COMPLETED" &&
            <span className="px-2 py-1 rounded text-green-600 font-medium bg-green-400/10 block text-xs">
                {/* <CheckIcon /> */}
                Completed
            </span>
        }
        {status === "successful" &&
            <span className="px-2 py-1 rounded text-green-600 font-medium bg-green-400/10 block text-xs">
                {/* <CheckIcon /> */}
                Successful
            </span>
        }
        {status === "CANCELED" &&
            <span className="px-2 py-1 rounded text-red-600 bg-red-400/10 block text-xs">
                {/* <CloseIcon width={22} /> */}
                Cancelled
            </span>
        }
        {status === "failed" &&
            <span className="px-2 py-1 rounded text-red-600 bg-red-400/10 block text-xs">
                {/* <CloseIcon width={22} /> */}
                Failed
            </span>
        }
    </>
  )
}

export default OrderStatus