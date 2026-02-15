import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ERROR } from '../../../store/types';
import { updateOrder } from '../../../store/actions/ordersActions';
import SelectField from '../form/SelectField';
import InlinePreloader from '../InlinePreloader';

const UpdateOrderStatus = ({orderId, cancel, currentStatus}) => {
    const dispatch = useDispatch()
    const ordersState = useSelector((state => state.orders))
    const [status, setStatus] = useState(currentStatus || '');
    const [validationErrors, setValidationErrors] = useState({});

    const validateForm = () => {
        let errors = {}
        if(!status || status === '') {
            errors.status = true
        }

        setValidationErrors(errors)
        return errors
    }

    const pushUpdate = () => {
        if (Object.values(validateForm()).includes(true)) {
            dispatch({
                type: ERROR,
                error: {response: {data: {
                    message: 'Please check the highlighted fields'
                }}}
              });
            return
        }
        dispatch(updateOrder(orderId, {status: status}))
    }

    const statusOptions = [
        {label: 'Preparing Order', value: 'PREPARING_ORDER'},
        {label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY'},
        {label: 'Delivered', value: 'COMPLETED'},
        {label: 'Cancelled', value: 'CANCELLED'}
    ]

    return (
        <>
        <div className='w-full'>
            <SelectField
                selectOptions={statusOptions}
                inputLabel="Select order status"
                titleField="label"
                displayImage={false}
                inputPlaceholder={`Click to select`}
                imageField=""
                preSelected=''
                fieldId="account"
                hasError={false}
                returnFieldValue={(value) => {setStatus(value.value)}}
            />
        </div>

        <div className="mt-8 flex flex-row-reverse gap-x-4">
            <button
                type="button"
                className="inline-flex justify-center px-4 py-3 text-xs font-medium bg-green-600 text-white border border-transparent rounded hover:bg-green-800 focus:outline-none"
                onClick={()=>{pushUpdate()}}
            >
                {ordersState.updatingOrder ? <InlinePreloader /> : 'Update status'}
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

export default UpdateOrderStatus