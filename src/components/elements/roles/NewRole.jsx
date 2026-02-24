import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createRole, fetchPermissions } from '../../../store/actions/rolesPermissionsActions'
import Loader from '../Loader'
import { Switch } from '@headlessui/react'
import TextField from '../form/TextField'
import { ERROR } from '../../../store/types'
import InlinePreloader from '../InlinePreloader'

const NewRole = ({reload, close}) => {
    const dispatch = useDispatch()
    const rolesSelector = useSelector(state => state.roles)
    const [rolePayload, setRolePayload] = useState({})
    useEffect(() => {
        dispatch(fetchPermissions())
        
        
        return () => {
            
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

        const [selectedPermissions, setSelectedPermissions] = useState([]);

    // const [accountPermissionsList, setAccountPermissionsList] = useState(initialState);
  
    const togglePermissionSelection = (sectionIndex, permissionIndex) => {
        const sections = rolesSelector.permissions.sections;

        // build arrays of permission values without using flatMap
        const allValues = sections.reduce((acc, s) => {
            return acc.concat(s.permissions.map((p) => p.value));
        }, []);

        const sectionValues = sections[sectionIndex].permissions.map((p) => p.value);
        const clickedValue = sectionValues[permissionIndex];

        // guard (avoid runtime error if something unexpected)
        if (!clickedValue) return;

        const globalFirstValue = sections[0]?.permissions?.[0]?.value;

        // Use Set for easier add/remove
        const selectedSet = new Set(selectedPermissions || []);

        // helper checks
        const isAllSelected = () => allValues.every(v => selectedSet.has(v));
        //   const isSectionSelected = (i) => {
        //     const vals = sections[i].permissions.map((p) => p.value);
        //     return vals.every(v => selectedSet.has(v));
        //   };

        // 1) Global select-all (the very first permission [0][0])
        if (sectionIndex === 0 && permissionIndex === 0) {
            if (isAllSelected()) {
            // turn everything off
            selectedSet.clear();
            } else {
            // turn everything on
            allValues.forEach(v => selectedSet.add(v));
            }
        }

        // 2) Section select-all ([s][0], s > 0)
        else if (permissionIndex === 0) {
            const secVals = sectionValues;
            const secSelected = secVals.every(v => selectedSet.has(v));

            if (secSelected) {
            // turn off this section
            secVals.forEach(v => selectedSet.delete(v));
            } else {
            // turn on this section
            secVals.forEach(v => selectedSet.add(v));
            }
        }

        // 3) Individual permission in a section (permissionIndex > 0)
        else {
            if (selectedSet.has(clickedValue)) {
            // Turning this permission OFF:
            // - remove just this permission
            // - also ensure the section's "select all" and the global select-all are turned off
            selectedSet.delete(clickedValue);

            // remove the section-first (if present)
            const sectionFirst = sectionValues[0];
            if (sectionFirst) selectedSet.delete(sectionFirst);

            // remove global first (because "not all" anymore)
            if (globalFirstValue) selectedSet.delete(globalFirstValue);
            } else {
            // Turning this permission ON:
            selectedSet.add(clickedValue);

            // If this makes the section fully selected, ensure section-first is present
            const sectionNowSelected = sectionValues.every(v => selectedSet.has(v));
            if (sectionNowSelected) {
                sectionValues.forEach(v => selectedSet.add(v)); // ensures section-first included
            }

            // If this makes everything selected, ensure global-first is present
            if (allValues.every(v => selectedSet.has(v)) && globalFirstValue) {
                allValues.forEach(v => selectedSet.add(v)); // ensures global-first included
            }
            }
        }

        // Reconcile consistency (remove section-firsts for partially selected sections,
        // add them if a section is fully selected; same for global-first)
        sections.forEach((s, i) => {
            const vals = s.permissions.map((p) => p.value);
            const first = vals[0];
            const valsAllSelected = vals.every(v => selectedSet.has(v));
            if (valsAllSelected) {
            // ensure first is present (it will be since vals include first)
            first && selectedSet.add(first);
            } else {
            // ensure first is not present
            first && selectedSet.delete(first);
            }
        });

        // global reconciliation
        if (globalFirstValue) {
            if (allValues.every(v => selectedSet.has(v))) {
            allValues.forEach(v => selectedSet.add(v));
            selectedSet.add(globalFirstValue);
            } else {
            selectedSet.delete(globalFirstValue);
            }
        }

        // finalize
        setSelectedPermissions(Array.from(selectedSet));
    };



    const [validationErrors, setValidationErrors] = useState({})
    const validateForm = () =>{
        let errors = {}
        if(!rolePayload.name || rolePayload.name === '') {
            errors.name = true
        }

        setValidationErrors(errors)
        return errors
    }

    const pushRole = () => {
        if(Object.keys(validateForm()).includes(true)){
            dispatch({
                type: ERROR,
                error: {response: {data: {message: 'Form validation error: please check the highlighted fields'}}}
            })
            return
        }
        dispatch(createRole({...rolePayload, permissions: selectedPermissions}))
    }
    return (
        <div className='w-full'>
            <div className='w-full'>
                <TextField
                    inputType="text" 
                    fieldId="role-name"
                    inputLabel="Role name" 
                    preloadValue={''}
                    inputPlaceholder={`Choose a name for the role`}
                    hasError={validationErrors.name} 
                    returnFieldValue={(value)=>{setRolePayload({...rolePayload, ...{name: value}})}}
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
                    returnFieldValue={(value)=>{setRolePayload({...rolePayload, ...{description: value}})}}
                />
            </div>
            <h3 className='font-medium mt-6 mb-2'>User Account permissions</h3>
            <p className='text-sm mb-8'>Use the toggles below to grant the user's account permissions to different modules of the system</p>

            {rolesSelector.loadingPermissions ? 
            <Loader preloadingText={`fetching permissions...`} />
            :
            <>
            {rolesSelector?.permissions?.sections.map((section, sectionIndex)=>(<div className='w-full mb-8' key={sectionIndex}>
                <h3 className="font-medium text-sm">{section.title}</h3>
                {section.permissions.map((permission, permissionIndex)=>(<div key={permissionIndex} className='w-full py-4 border-b border-gray-300 flex gap-x-4 items-start justify-between'>
                    <div className='w-full'>
                        <p className="text-sm text-gray-600">
                            {permission.label}
                        </p>
                    </div>
                    <div className='w-24 flex flex-row-reverse'>
                        <Switch
                            checked={selectedPermissions.includes(permission.value)}
                            onChange={()=>{togglePermissionSelection(sectionIndex, permissionIndex)}}
                            className={`${
                                selectedPermissions.includes(permission.value) ? 'bg-ss-dark-blue' : 'bg-gray-200'
                            } relative inline-flex items-center h-5 rounded-full w-10`}
                            >
                            {/* <span className="sr-only">Display stock levels</span> */}
                            <span
                                className={`transform transition ease-in-out duration-200 ${
                                    selectedPermissions.includes(permission.value) ? 'translate-x-6' : 'translate-x-1'
                                } inline-block w-3 h-3 transform bg-white rounded-full`}
                            />
                        </Switch>
                    </div>
                </div>))}
            </div>
                
            ))}
            </>}

            <div className="mt-8 flex flex-row-reverse gap-x-4">
                <button
                    type="button"
                    className="inline-flex justify-center px-5 py-4 text-sm font-medium bg-ss-dark-blue text-white border border-transparent transition duration-200 rounded-lg hover:bg-ss-black focus:outline-none"
                    onClick={()=>{pushRole()}}
                >
                   {rolesSelector.creatingRole ? <InlinePreloader /> : 'Create Role'}
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

export default NewRole