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
            payment.receivingChannel = storeSettings?.receivingAccounts?.accounts[selectedAccount]
        }

        receivePayment(payment)
    }
    
    return (
        <div>
            <div className="my-4 pb-2.5">
                <SelectField
                    selectOptions={paymentChannels}
                    inputLabel="Select payment channel"
                    titleField="label"
                    displayImage={false}
                    imageField=""
                    preSelected=''
                    fieldId="payment-channel"
                    hasError={channelError}
                    returnFieldValue={(value) => {
                        setSelectedChannel(value.value)}}
                />
            </div>
            {selectedChannel === 'pos' && <div className="my-4 pb-2.5">
                <SelectField
                    selectOptions={storeSettings?.posDevices?.devices}
                    inputLabel="Select POS device"
                    titleField="deviceName"
                    displayImage={false}
                    imageField=""
                    preSelected=''
                    fieldId="pos-device"
                    hasError={channelError}
                    returnFieldValue={(value) => {setSelectedPosDevice(value)}}
                />
            </div>}
            {selectedChannel === 'transfer' && <div className="my-4 pb-2.5">
                {storeSettings?.receivingAccounts?.accounts.map((account, accountIndex) => (
                    <button key={accountIndex} onClick={()=>{setSelectedAccount(accountIndex)}} className={`p-3 border rounded my-2 text-left w-full block ${selectedAccount === accountIndex ? 'border-green-500' : 'border-gray-300'}`}>
                        <p className='font-medium text-md text-green-500'>{account.accountName}</p>
                        <p className="text-sm text-gray-600">{account.bank} - {account.accountNumber}<br /><span className="text-xs text-gray-400">{account.description}</span></p>
                    </button>
                ))}
            </div>}

            <div className="my-8">
                <label className='font-medium text-sm mb-3 text-gray-400'>Order total</label>
                <p className='text-4xl text-gray-600 font-courier-prime'>₦{paymentAmount.toLocaleString()}</p>
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
                    className="inline-flex justify-center px-4 py-4 text-xs font-medium bg-green-600 text-white border border-transparent rounded hover:bg-green-800 focus:outline-none transition duration-200"
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