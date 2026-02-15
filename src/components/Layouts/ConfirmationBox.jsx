import { Dialog, Transition } from '@headlessui/react'
import React, {Fragment} from 'react'
import FormButton from '../elements/form/FormButton'

const ConfirmationBox = ({
    children, 
    isOpen, 
    closeModal, 
    confirmButtonAction, 
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog
            as="div"
            className="fixed inset-0 overflow-y-auto z-40"
            onClose={closeModal}
        >
            <div className="min-h-screen px-4 text-center">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-90" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                    className="inline-block h-screen align-middle"
                    aria-hidden="true"
                >
                &#8203;
                </span>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <div className={`relative inline-block xl:max-w-md p-4 my-8 overflow-hidden text-left align-middle transition-all transform bg-transparent shadow-xl rounded-2xl`}>
                        {/* <button className='rounded-full bg-white bg-opacity-10 absolute top-0 right-5 text-white w-10 h-10' onClick={()=>{closeModal()}}>
                            <CloseIconCircled className="h-10 w-10" />
                        </button>
                        <h3
                            // as="h3"
                            className="text-2xl font-bold leading-6 text-white text-center mb-8 pt-8"
                        >
                            <p>{dialogTitle}</p>
                            <p>{dialogIntro && dialogIntro !== '' && <span className='text-base inline-block mt-4 font-normal'>{dialogIntro}</span>}</p>
                        </h3> */}

                        <div className="mt-2 p-8 bg-white rounded-xl">
                            {children}
                            <div className='w-full flex flex-row-reverse items-center mt-4'>
                                <FormButton buttonLabel="Confirm" buttonAction={()=>{confirmButtonAction()}} processing={false}  />
                                
                                <button type='submit' onClick={()=>{closeModal()}} className='w-full p-4 bg-transparent text-gray-500 text-md rounded-md transition duration-200 hover:text-nadabake-purple flex items-center justify-center'>Cancel</button>
                            </div>
                        </div>

                    </div>
                </Transition.Child>
            </div>
        </Dialog>
    </Transition>
  )
}

export default ConfirmationBox