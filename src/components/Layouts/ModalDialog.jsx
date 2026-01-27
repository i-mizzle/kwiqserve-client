import React, { Fragment } from 'react';
import { Dialog, DialogTitle, Transition } from '@headlessui/react';
import CloseIcon from '../elements/icons/CloseIcon';

const ModalDialog = ({
  children,
  shown,
  closeFunction,
  dialogTitle,
  maxWidthClass,
}) => {
  return (
    <Transition appear show={shown} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto bg-[#00000050] bg-opacity-20"
        onClose={closeFunction}
        style={{zIndex: 998}}
      >
        <div className="min-h-screen px-4 text-center">
          {/* <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" style={{zIndex:997}} />
          </Transition.Child> */}

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
            <div
              className={`inline-block w-full ${maxWidthClass || ''} p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-[8px] `}
            >
              <div className='w-full flex items-start justify-between gap-x-[10px]'>
                <DialogTitle
                  as="h3"
                  className="text-md font-medium leading-6 mb-2 w-full"
                >
                  {dialogTitle}
                </DialogTitle>
                <button className='text-gray-400 hover:text-black transition duration-200' onClick={closeFunction}><CloseIcon className={`w-5 h-5`} /></button>
              </div>
              <div className="mt-1">{children}</div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalDialog;
