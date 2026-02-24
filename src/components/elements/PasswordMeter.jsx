import React, { useState, useEffect } from 'react';
import CheckIcon from './icons/CheckIcon';

const PasswordMeter = ({ password }) => {
  const [checks, setChecks] = useState({
    lowercase: false,
    uppercase: false,
    special: false,
    number: false,
    minEightChars: false
  });

  useEffect(() => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasMinEightChars = password?.length >= 8;

    setChecks({
      lowercase: hasLowercase,
      uppercase: hasUppercase,
      special: hasSpecial,
      number: hasNumber,
      minEightChars: hasMinEightChars
    });
  }, [password]);

  return (
    <div className='mt-5'>
      <h3 className='text-gray-500 mb-3 text-sm'>A good password should:</h3>
      <div className='grid grid-cols-1 gap-3.75 w-full px-2.5'>
        <div className='w-full'>
            <div className='flex items-center gap-x-2.5'>
                <div className={`w-5 h-5 flex items-center justify-center transition duration-200 rounded-full ${checks.lowercase ? 'bg-ss-pale-blue' : 'bg-gray-100'}`}>
                    {checks.lowercase && <CheckIcon className={'text-green-600 w-4 h-4'} />}
                </div>
                <p className={`text-xs transition duration-200 font-medium ${checks.lowercase ? 'text-ss-black' : 'text-gray-400'}`}>
                    Contain at least one lowercase character
                </p>
            </div>
        </div>
        <div className='w-full'>
            <div className='flex items-center gap-x-2.5'>
                <div className={`w-5 h-5 transition duration-200 flex items-center justify-center rounded-full ${checks.uppercase ? 'bg-ss-pale-blue' : 'bg-gray-100'}`}>
                    {checks.uppercase && <CheckIcon className={'text-green-600 w-4 h-4'} />}
                </div>
                <p className={`text-xs transition duration-200 font-medium ${checks.uppercase ? 'text-ss-black' : 'text-gray-400'}`}>
                    Contain at least one uppercase character
                </p>
            </div>
        </div>
        <div className='w-full'>
            <div className='flex items-center gap-x-2.5'>
                <div className={`w-5 h-5 flex items-center justify-center transition duration-200 rounded-full ${checks.special ? 'bg-ss-pale-blue' : 'bg-gray-100'}`}>
                    {checks.special && <CheckIcon className={'text-green-600 w-4 h-4'} />}
                </div>
                <p className={`text-xs transition duration-200 font-medium ${checks.special ? 'text-ss-black' : 'text-gray-400'}`}>
                    Contain at least one special character (eg: !@#$%^&*)
                </p>
            </div>
        </div>
        <div className='w-full'>
            <div className='flex items-center gap-x-2.5'>
                <div className={`w-5 h-5 flex items-center justify-center transition duration-200 rounded-full ${checks.number ? 'bg-ss-pale-blue' : 'bg-gray-100'}`}>
                    {checks.number && <CheckIcon className={'text-green-600 w-4 h-4'} />}
                </div>
                <p className={`text-xs transition duration-200 font-medium ${checks.number ? 'text-ss-black' : 'text-gray-400'}`}>
                    Contain at least one number
                </p>
            </div>
        </div>
        <div className='w-full'>
            <div className='flex items-center gap-x-2.5'>
                <div className={`w-5 h-5 flex items-center justify-center transition duration-200 rounded-full ${checks.minEightChars ? 'bg-ss-pale-blue' : 'bg-gray-100'}`}>
                    {checks.minEightChars && <CheckIcon className={'text-green-600 w-4 h-4'} />}
                </div>
                <p className={`text-xs transition duration-200 font-medium ${checks.minEightChars ? 'text-ss-black' : 'text-gray-400'}`}>
                    Be a minimum of eight characters long
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordMeter;
