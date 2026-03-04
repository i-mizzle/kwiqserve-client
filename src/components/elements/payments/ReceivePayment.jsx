import React, { useState } from 'react'
import SelectField from '../form/SelectField';
import Checkbox from '../form/Checkbox';


const ReceivePayment = ({storeSettings, paymentAmount, closeTransaction, receivePayment, activeSession}) => {
    const paymentChannels = [
        {
            label: "Cash",
            value: "cash"
        },
        {
            label: "POS Machine",
            value: "pos"
        },
        {
            label: "Bank Transfer",
            value: "transfer"
        },
        // {
        //     label: "Bar Tab",
        //     value: "pos"
        // },
    ]

    const [channelError, setChannelError] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [selectedPosDevice, setSelectedPosDevice] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const [doReceiptPrint, setDoReceiptPrint] = useState(false);

    const doReceive = () => {
        if(!selectedChannel || selectedChannel === '') {
            setChannelError(true)
            return
        }

        let payment = {
            status: "successful",
            channel: selectedChannel,
            amount: paymentAmount,
            doReceiptPrint
        }

        if(selectedChannel === 'pos') {
            payment.receivingChannel = selectedPosDevice
        }

        if(selectedChannel === 'transfer') {
            payment.receivingChannel = storeSettings?.receivingAccounts[selectedAccount]?.account._id
        }

        receivePayment(payment)
    }
    
    return (
        <div>
            <div className="my-2">
                <SelectField
                    selectOptions={paymentChannels}
                    inputLabel="Select payment channel"
                    titleField="label"
                    displayImage={false}
                    imageField=""
                    preSelected=''
                    fieldId="payment-channel"
                    inputPlaceholder={`Select Payment Channel`}
                    hasError={channelError}
                    returnFieldValue={(value) => {
                        setSelectedChannel(value.value)}}
                />
            </div>
            {selectedChannel === 'pos' && <div className="my-2">
                <SelectField
                    selectOptions={storeSettings?.posDevices?.devices}
                    inputLabel="Select POS device"
                    titleField="deviceName"
                    displayImage={false}
                    inputPlaceholder={`Select POS device`}
                    imageField=""
                    preSelected=''
                    fieldId="pos-device"
                    hasError={channelError}
                    returnFieldValue={(value) => {setSelectedPosDevice(value)}}
                />
            </div>}
            {selectedChannel === 'transfer' && <div className="my-2">
                {storeSettings?.receivingAccounts?.map((account, accountIndex) => (
                    <button key={accountIndex} onClick={()=>{setSelectedAccount(accountIndex)}} className={`p-3 cursor-pointer border rounded my-2 text-left w-full block ${selectedAccount === accountIndex ? 'border-ss-dark-blue' : 'border-gray-300'}`}>
                        <p className='font-medium text-md text-ss-dark-blue capitalize'>{account.account.accountName.toLowerCase()}</p>
                        <p className="text-sm text-gray-600">{account.account.bankName} - {account.account.accountNumber}<br /><span className="text-xs text-gray-400">{account.description}</span></p>
                    </button>
                ))}
            </div>}

            <div className="mb-4">
                <label className='font-medium text-sm mb-3 text-gray-400'>Order total</label>
                <h1 className='text-4xl font-semibold text-gray-600 font-courier-prime'>₦{paymentAmount.toLocaleString()}</h1>
            </div>

            <div className="w-full flex items-center my-2">
                {/* <input id="do-receipt-print" type='checkbox' 
                    checked={doReceiptPrint} 
                    onChange={()=>{setDoReceiptPrint(!doReceiptPrint)}} /> */}
                <Checkbox isChecked={doReceiptPrint} checkboxToggleFunction={()=>{setDoReceiptPrint(!doReceiptPrint)}} />
                <label htmlFor='do-receipt-print' className='text-sm text-gray-600'>Print a receipt for this order</label>
            </div>

            <div className="mt-8 flex flex-row-reverse gap-x-4 pb-2.5">
                <button
                    type="button"
                    className="inline-flex justify-center px-4 py-4 text-xs font-medium bg-ss-dark-blue text-white border border-transparent rounded hover:bg-ss-black focus:outline-none transition duration-200"
                    onClick={()=>{doReceive()}}
                >
                    Receive Payment & Close Order
                </button>

                <button
                    type="button"
                    className="inline-flex justify-center px-4 py-4 transition duration-200 text-xs font-medium bg-transparent border border-transparent rounded hover:bg-opacity-50 hover:bg-gray-200 focus:outline-none"
                    onClick={closeTransaction}
                >
                    Close
                </button>
                
            </div>
        </div>
    )
}

export default ReceivePayment