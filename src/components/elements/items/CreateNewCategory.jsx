import React, { useEffect, useState } from 'react'
import TextField from '../form/TextField'
// import { nanoid } from 'nanoid'
import SelectField from '../form/SelectField';
import { useDispatch, useSelector } from 'react-redux';
import InlinePreloader from '../InlinePreloader';
import { clearCreatedCategory, createCategory } from '../../../store/actions/categoriesActions';
// import db from '../../../db';
// const db = require('../../../db');

// const { ipcRenderer } = require('electron');


const CreateNewCategory = ({reload, type, closeNewCategory}) => {
    const dispatch = useDispatch()
    // const dataState = useSelector((state => state.syncData))
    const categoriesState = useSelector((state => state.categories))
    const [categoryPayload, setCategoryPayload] = useState({type: type || undefined});
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if(categoriesState.createdCategory !== null) {
            reload()
            closeNewCategory()
            dispatch(clearCreatedCategory())
        }
        return () => {
            
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoriesState.createdCategory]);

    const validateForm = () => {
        let errors = {}
    
        if(!categoryPayload.name || categoryPayload.name === '') {
            errors.name = true
        }
        
        setValidationErrors(errors)
        return errors
    }

    const createNewCategory = async () => {
        if (Object.values(validateForm()).includes(true)) {
            return
        }
        dispatch(createCategory(
           categoryPayload
        ))
    }

    const categoryTypes = [
        {label: 'Store', value: 'store'},
        {label: 'Sale', value: 'sale'}
    ]
    return (
        <>
            <div className='w-full'>
                <TextField
                    inputType="text" 
                    fieldId="category-name"
                    inputLabel="Category name" 
                    preloadValue={''}
                    inputPlaceholder={`Choose a category name`}
                    hasError={validationErrors.name} 
                    returnFieldValue={(value)=>{setCategoryPayload({...categoryPayload, ...{name: value}})}}
                />
            </div>
            <div className='w-full my-2'>
                <TextField
                    inputType="text" 
                    fieldId="category-description"
                    inputLabel="Description" 
                    preloadValue={''}
                    inputPlaceholder={`A short description of the category`}
                    hasError={false} 
                    returnFieldValue={(value)=>{setCategoryPayload({...categoryPayload, ...{description: value}})}}
                />
            </div>
            {/* {!type && <div className='w-full my-2'>
                <SelectField
                    selectOptions={categoryTypes}
                    inputLabel="Select category type"
                    titleField="label"
                    displayImage={false}
                    imageField=""
                    preSelectedIndex={categoryTypes.findIndex(type => type.value === categoryPayload.type) || ''}
                    fieldId="account"
                    hasError={false}
                    // return id of accounts of the selected option
                    returnFieldValue={(value) => { setCategoryPayload({ ...categoryPayload, ...{ type: value.value } }) }}
                />
            </div>} */}

            <div className="mt-8 flex flex-row-reverse gap-x-4">
                <button
                    type="button"
                    className="inline-flex justify-center px-5 py-4 text-sm font-medium bg-ss-dark-blue text-white border border-transparent transition duration-200 rounded-lg hover:bg-ss-black focus:outline-none"
                    onClick={()=>{createNewCategory()}}
                >
                   {categoriesState.creatingCategory ? <InlinePreloader /> : 'Save Category'}
                </button>

                <button
                    type="button"
                    className="inline-flex justify-center px-4 py-3 text-sm font-medium bg-transparent transition duration-200 border border-transparent rounded hover:bg-opacity-50 hover:bg-gray-100 focus:outline-none"
                    onClick={closeNewCategory}
                >
                    Close
                </button>
                
            </div>
        </>
    )
}

export default CreateNewCategory