import React, { useRef, useState } from 'react'
import CloseIcon from './icons/CloseIcon'

import PlusIcon from './icons/PlusIcon'
import FunnelIcon from './icons/FunnelIcon'
import { useOutsideAlerter } from './form/SelectField'

const Filters = ({filterOptions, returnSelected, resetFilters, checkConditions}) => {
    const [ activeFilters, setActiveFilters ] = useState([])
    const [ selectingFilters, setSelectingFilters ] = useState(false)
    const [ activeFilterOption, setActiveFilterOption ] = useState(null)
    const [ filterLinkOption, setFilterLinkOption ] = useState(null)
    const [ filterValue, setFilterValue ] = useState(null)

    const addFilter = (index) => {
        if(!filterValue || filterValue === '') {
            return
        }

        if(filterOptions[index].linkType === 'option' && (!filterLinkOption || filterLinkOption === '')) {
            return
        }

        const tempActiveFilters = JSON.parse(JSON.stringify(activeFilters))

        let filterLink = 'is'
        if(filterOptions[index].linkType === 'option') {
            filterLink = filterLinkOption
        }
        
        const currentFilter = JSON.parse(JSON.stringify(filterOptions[index]))

        currentFilter.displayValue = `${filterOptions[index].name} ${filterLink} ${filterValue}`
        currentFilter.value =  filterValue

        tempActiveFilters.push(currentFilter)
        setActiveFilters(tempActiveFilters)

        returnSelected(parseFiltersToString(tempActiveFilters))
        setFilterLinkOption(null)
        setActiveFilterOption(null)
        setFilterValue(null)
        setSelectingFilters(false)
    }

    const parseFiltersToString = (filters) => {
        let filtersString = ''
        let filterValueLabel = ''
        filters.forEach((filter)=> {
            if(filtersString !== '') {
                filtersString += '&'
            }
            if(filter.valueLabelOptions) {
                filterValueLabel = filter.valueLabelOptions[filterLinkOption]
            } else {
            filterValueLabel = filter.valueLabel
            }
            filtersString += `${filterValueLabel}=${filter.value}`
        })

        return filtersString
    }

    const removeFilter = (filter) => {
        const newFilters = activeFilters.filter((item) => {
            return filter !== item 
        })
        setActiveFilters(newFilters)
        returnSelected(parseFiltersToString(newFilters))
    }

    const toggleFilterSelection = () => {
        if(!selectingFilters) {
            setSelectingFilters(true)
            return
        }
        setActiveFilterOption(null)
        setSelectingFilters(false)
    }

    return (
        <div className="flex flex-row gap-2 flex-wrap">
            <span className={`py-2 px-3 rounded-md text-gray-800 shadow-lg border shadow-blue-600/5 bg-white ${activeFilters && activeFilters.length > 0 ? 'border-blue-200' : 'border-transparent'}`}> 
                <FunnelIcon className="w-4 h-4 inline" /> Filters
            </span>

            { activeFilters.map((filter, filterIndex) => (
                <span className='py-2 px-3 rounded-md bg-white text-gray-600 flex gap-x-3 items-center text-sm font-outfit shadow-lg shadow-blue-600/5' key={filterIndex}> 
                    {filter.displayValue}
                    <button onClick={()=>{removeFilter(filter)}}>
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </span>
            ))}

            <div className='relative'>
                <button className='p-3 rounded-md bg-white text-gray-600 transition duration-200 shadow-lg shadow-blue-600/5 hover:bg-gray-200 font-outfit' onClick={()=>{toggleFilterSelection()}}>
                    <PlusIcon className={`transition duration-200 w-5 h-5 ${selectingFilters && 'rotate-45'}`}/>
                </button>
                <div className={`z-50 bg-white rounded-md shadow-lg p-2 w-50 h-inherit absolute top-0 left-13.75 font-outfit border border-ss-pale-blue ${selectingFilters ? 'inline-block' : 'hidden' }`}>
                    <div className='relative'>
                        {filterOptions.map(( option, optionIndex ) => (
                            optionIndex !== 0 && <span key={optionIndex}>
                                <button className={`capitalize text-sm text-left my-1 p-2 hover:bg-gray-100 rounded-sm transition duration-200 text-gray-600 w-full block ${optionIndex === activeFilterOption ? 'bg-gray-100' : ''}`} onClick={()=>{setActiveFilterOption(optionIndex)}}>
                                    {option.name}
                                </button>

                                {activeFilterOption && activeFilterOption === optionIndex && 
                                    <div className='w-full rounded-sm p-1 bg-white'>
                                        {/* <p className="text-sm text-gray-600 mb-2 rounded-sm capitalize">{filterOptions[activeFilterOption].name}</p> */}
                                        {filterOptions[activeFilterOption].linkType === 'text' && <p className="text-sm text-gray-600">{filterOptions[activeFilterOption].link}</p>}
                                        {filterOptions[activeFilterOption].linkType === 'option' && 
                                            <select className="text-sm text-gray-600 p-1 border rounded-sm w-full my-2 outline-none" onChange={(e)=>{setFilterLinkOption(e.target.value)}}>
                                                <option value="">-- select one --</option>
                                                {filterOptions[activeFilterOption].link.map((linkOption, linkOptionIndex)=>(
                                                    <option key={linkOptionIndex} value={linkOption}>{linkOption}</option>
                                                ))}
                                            </select>
                                        }
                                        {filterOptions[activeFilterOption].type === 'binary' && 
                                            <select className="text-sm text-gray-600 p-1 border rounded-sm w-full my-2 outline-none" onChange={(e)=>{setFilterValue(e.target.value)}}>
                                                <option value="">-- select one --</option>
                                                {filterOptions[activeFilterOption].options.map((option, optionIndex)=>(
                                                    <option key={optionIndex} value={
                                                        filterOptions[activeFilterOption].optionValueName && filterOptions[activeFilterOption].optionValueName !== '' 
                                                        ? option[filterOptions[activeFilterOption].optionValueName] 
                                                        : option}>{
                                                            filterOptions[activeFilterOption].optionLabelName && filterOptions[activeFilterOption].optionLabelName !== '' ? option[filterOptions[activeFilterOption].optionLabelName] : option}</option>
                                                ))}
                                            </select>
                                        }

                                        {filterOptions[activeFilterOption].type === 'number' && 
                                            <input placeholder='value' type='number' className="text-sm text-gray-600 p-1 border rounded-sm w-full my-2 outline-none"  onChange={(e)=>{setFilterValue(e.target.value)}} />
                                        }

                                        {filterOptions[activeFilterOption].type === 'date' && 
                                            <input placeholder='date' type='date' className="text-sm text-gray-600 p-1 border rounded-sm w-full my-2 outline-none"  onChange={(e)=>{setFilterValue(e.target.value)}} />
                                        }

                                        {/* {filterOptions[activeFilterOption].type === 'number' && filterLinkOption === 'is between' && 
                                            <input placeholder='value' type='number' className="text-sm text-gray-600 p-1 border rounded-sm w-full my-2 outline-none" onChange={(e)=>{setFilterValue(e.target.value)}} />
                                        } */}

                                        {/* {filterOptions[activeFilterOption].type === 'date' && filterLinkOption === 'is between' && 
                                            <input placeholder='date' type='date' className="text-sm text-gray-600 p-1 border rounded-sm w-full my-2 outline-none"  onChange={(e)=>{setFilterValue(e.target.value)}} />
                                        } */}

                                        <button className='w-full p-1 rounded-sm text-white text-sm bg-gray-600 my-3 transition duration-200 hover:bg-gray-800' onClick={()=>{addFilter(activeFilterOption)}}>Add Filter</button>
                                    </div>
                                }
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Filters