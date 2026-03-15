import React, { useEffect, useEffectEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TextField from '../form/TextField'
import AutocompleteSelect from '../form/AutocompleteSelect'
import { fetchMenus } from '../../../store/actions/menusActions'
import InlinePreloader from '../InlinePreloader'
import { ERROR } from '../../../store/types'
import { createTable } from '../../../store/actions/tablesActions'

const NewTable = ({close}) => {
    const tablesSelector = useSelector(state => state.tables)
    const menusSelector = useSelector(state => state.menus)
    const dispatch = useDispatch()

    useEffect(() => {
      
        dispatch(fetchMenus('', 0, 0))
    
        return () => {
            
        }
    }, [])
    

    const [tablePayload, setTablePayload] = useState({})
    const [validationErrors, setValidationErrors] = useState({})
    
    const validateForm = () => {
        let errors = {}

        if(!tablePayload.name || tablePayload.name === ''){
            errors.name = true
        }

        if(!tablePayload.code || tablePayload.code === '') {
            errors.code = true
        }

        if(!tablePayload.description || tablePayload.description === '') {
            errors.description = true
        }

        if(!tablePayload.menu || tablePayload.menu === '') {
            errors.menu = true
        }

        setValidationErrors(errors)
        return errors
    }

    const pushTable = () => {
        if(Object.values(validateForm()).includes(true)) {
            dispatch({
                type: ERROR,
                error: {response: {data: {message: 'Form validation error: Please check highlighted fields'}}}
            })
            return
        }

        dispatch(createTable(tablePayload))
    }

    return (
        <div className='w-full'>
            <p className='text-sm mb-4'>Please provide details of the table below to create it. Once created, a QRCode will be generated for thee table which you can download and print out.</p>
            <div className='my-2'>
                <TextField
                    inputType="text" 
                    fieldId="table-name"
                    inputLabel="Table Name" 
                    inputPlaceholder={`Add a name for the table`}
                    preloadValue={tablePayload.name || ''}
                    hasError={validationErrors.name} 
                    returnFieldValue={(value)=>{setTablePayload({...tablePayload, ...{name: value}})}}
                />
            </div>
            <div className='my-2'>
                <TextField
                    inputType="text" 
                    fieldId="table-code"
                    inputLabel="Table code" 
                    inputPlaceholder={`Create table code`}
                    preloadValue={tablePayload.code || ''}
                    hasError={validationErrors.code} 
                    returnFieldValue={(value)=>{setTablePayload({...tablePayload, ...{code: value}})}}
                    helperText={`Create a short memorable code to easily refer to the table.`}
                />
            </div>
            <div className='my-2'>
                <TextField
                    inputType="text" 
                    fieldId="table-description"
                    inputLabel="Description" 
                    inputPlaceholder={`Add a description`}
                    preloadValue={tablePayload.description || ''}
                    hasError={validationErrors.description} 
                    returnFieldValue={(value)=>{setTablePayload({...tablePayload, ...{description: value}})}}
                />
            </div>
            <div className='my-2'>
                {menusSelector?.fetchingMenus ?
                    <div className='w-full flex items-center justify-center'>
                        <InlinePreloader />
                    </div>
                : 
                <>
                    {menusSelector?.menus?.menus?.length > 0 ? <AutocompleteSelect
                        selectOptions={menusSelector?.menus?.menus}
                        inputLabel="Select item"
                        titleField="name"
                        displayImage={false}
                        imageField=""
                        preSelected={tablePayload.menu || ''}
                        preSelectedLabel={'_id'}
                        fieldId="menu-item"
                        inputPlaceholder={`Click to select or start typing to search`}
                        hasError={validationErrors && validationErrors.menu}
                        returnFieldValue={(value) => {
                            setTablePayload({...tablePayload, menu: value._id});
                        }}
                    /> :
                        <div className='my-2 bg-gray-50 p-5 rounded'>
                            <p className='font-[550] text-ss-dark-gray font-family-bricolage-grotesque text-sm mb-1'>No Menus Found</p>
                            <p className='text-xs text-gray-500'>Please create a menu to add it to a table. Navigate to "Menus" in the header above and click on "Create new menu" to get started.</p>
                        </div>
                    }
                </>
                }
            </div>

            <div className="mt-8 flex flex-row-reverse gap-x-4">
                <button
                    type="button"
                    disabled={menusSelector?.menus?.menus?.length === 0 || tablesSelector.creatingTable}
                    className="inline-flex justify-center px-5 py-4 text-sm font-medium bg-ss-dark-blue disabled:bg-ss-dark-gray disabled:cursor-not-allowed text-white border border-transparent transition duration-200 rounded-lg hover:bg-ss-black focus:outline-none"
                    onClick={()=>{pushTable()}}
                >
                    {tablesSelector.creatingTable ? <InlinePreloader /> : 'Create table'}
                </button>

                <button
                    type="button"
                    className="inline-flex justify-center px-4 py-3 text-sm font-medium bg-transparent transition duration-200 border border-transparent rounded hover:bg-opacity-50 hover:bg-gray-100 focus:outline-none"
                    onClick={close}
                >
                    Close
                </button>
                
            </div>
        </div>
    )
}

export default NewTable