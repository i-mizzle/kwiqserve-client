import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'; 
// import HorizontalMenuIcon  from '../../assets/images/icons/horizontal-menu-icon.svg'
import { Link } from 'react-router-dom'
import { Popover } from '@headlessui/react'
import { usePopper } from 'react-popper'
import DotsVertical from './icons/DotsVertical';
import Pagination from './Pagination';
import EmptyState from './EmptyState';

const DataTable = ({
    tableData, 
    tableHeaders, 
    columnWidths, 
    columnDataStyles, 
    allFields, 
    onSelectItems, 
    onSelectSingle,
    tableOptions, 
    pagination,
    updatePerPage,
    changePage
}) => {

    let [referenceElement, setReferenceElement] = useState()
    let [popperElement, setPopperElement] = useState()
    let { styles, attributes } = usePopper(referenceElement, popperElement)

    const [allItems, setAllItems] = useState([])
    const [selectedItemsCount, setSelectedItemsCount] = useState(0)

    useEffect(() => {
        setAllItems(tableData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    

    const toggleAllSelection = () => {
        let newItems = allItems
        newItems.forEach((singleItem) => {
            if (selectedItemsCount > 1) {
                singleItem.selected = false
            } else {
                singleItem.selected = true
            }
        })

        const itemsCount = newItems.filter((item) => {
            return item.selected;
        }).length

        setSelectedItemsCount(itemsCount)

        onSelectItems(itemsCount)
        setAllItems(newItems)
    }

    const toggleSelection = (itemIndex) => {
        let newItems = allItems
        newItems.forEach((singleItem, index) => {
            if (index === itemIndex ) {
                singleItem.selected = !singleItem.selected
            }
        })

        const itemsCount = newItems.filter((item) => {
            return item.selected;
        }).length

        setSelectedItemsCount(itemsCount)

        onSelectItems(itemsCount)
        setAllItems(newItems)
    }

    const selectSingle = (itemIndex) => {
        let newItems = allItems
        newItems.forEach((singleItem, index) => {
            if (index === itemIndex ) {
                singleItem.selected = true
            } else {
                singleItem.selected = false
            }
        })

        onSelectSingle(itemIndex)
        setAllItems(newItems)
    }

    const fieldIsSelected = (fieldName) => {
        let isSelected = false
        allFields.forEach((field) => {
            if(field.name === fieldName && field.selected) {
                isSelected = true
            }
        })
        return isSelected
    }

    const performRowAction = (index) => {
        if(!tableOptions.clickableRows || tableOptions.clickableRows === false) {
            return
        }
        tableOptions.rowAction(index)
    }
    
    return (
        <Fragment>
            {/* Table */}
            {!tableData || tableData.length === 0 ? 

                <div className='px-44 py-4'>
                    <EmptyState
                        emptyStateText={`Sorry, no data available at the moment`}
                    />
                </div>

                :
                
                <div className="pt-2">
                    {/* table header */}
                    <ul className="bg-gray-50 flex flex-row justify-between items-center w-full text-xs mt-1 px-3 py-2 relative font-[600]">
                       {/* <li className="w-1/12" />  */}
                        {tableOptions.selectable && tableOptions.multiselect && <input type="checkbox" className="mr-2 absolute left-0" onChange={()=>{toggleAllSelection()}} checked={tableData.length === selectedItemsCount} />}
                        {tableHeaders.map((header, headerIndex) => (
                            !header.forPopover && fieldIsSelected(header.columnDisplayName) &&
                            <li className={`${columnWidths[header.column]} flex flex-row items-center uppercase justify-between ml-2 text-gray-600`} key={headerIndex} >
                                {header.columnDisplayName}
                                {header.sortable && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                                </svg>}
                            </li> 
                        ))}
                        <span className="absolute right-1">
                            <Popover className="relative">
                                <Popover.Button 
                                    ref={setReferenceElement}
                                >
                                    {/* <img alt="" src={DotsVertical} className="transform rotate-90 w-4" /> */}
                                    <DotsVertical classes="h-6 w-6" />
                                </Popover.Button>

                                <Popover.Panel 
                                    ref={setPopperElement}
                                    style={styles.popper}
                                    {...attributes.popper} 
                                    className="absolute z-10"
                                >
                                    <div className="bg-primary p-4 shadow-md border rounded border-secondary mt-3">
                                        {/* {allFields.map((field, fieldIndex) => )} */}
                                        <p className="font-medium text-gray-400 text-sm pb-2 mb-2 border-b border-gray-200 text-center">All Fields</p>

                                        {allFields.map((field, fieldIndex) => (
                                            <div className="flex flex-row justify-between w-36 items-center my-2" key={fieldIndex}>
                                                <p className="text-xs">{field.name} </p>
                                                <input type="checkbox" checked={field.selected} className="mr-2" />
                                            </div>
                                        ))}
                                    </div>

                                </Popover.Panel>
                            </Popover>
                        </span>
                    </ul>

                    {/* Table rows */}
                    {allItems.map((data, dataIndex) => (
                        <ul onClick={()=>{performRowAction(dataIndex)}} className={`flex flex-row items-start w-full bg-opacity-40 text-xs mt-3 hover:bg-gray-50 cursor-pointer transition duration-200 py-2 px-1 font-sofia-pro text-gray-500 relative ${data.selected ? 'bg-gray-300 bg-opacity-10' : ''}`} key={dataIndex}>
                            {tableOptions.selectable && tableOptions.multiselect ? <input type="checkbox" onChange={()=>toggleSelection(dataIndex)} checked={data.selected} className="mr-2 ml-1" /> : <span className="inline-block mr-5" />}
                            {tableHeaders.map((header, headerIndex) => (
                                !header.forPopover && fieldIsSelected(header.columnDisplayName) &&                                  
                                <li 
                                    key={headerIndex} className={`${columnWidths[header.column]} flex flex-row items-center ${tableOptions.selectable && !tableOptions.multiselect ? 'cursor-pointer' : ''}`} 
                                    onClick={()=>{
                                        if(tableOptions.selectable && !tableOptions.multiselect) {
                                            selectSingle(dataIndex)
                                        }
                                    }}
                                >
                                    <span className={columnDataStyles[header.column] && columnDataStyles[header.column].isConditional ? columnDataStyles[header.column].conditionals[data[header.column]] : columnDataStyles[header.column]}>
                                        {header.columnDataType === 'image' &&
                                        <img src={data[header.column]} alt="" />
                                        }

                                        {header.columnDataType === 'link' &&
                                        <Link to={data[header.column]} alt="" className="text-ink-navy font-medium"> {data[header.column]} </Link>
                                        }

                                        {header.columnDataType === 'text' &&
                                        <div> {data[header.column]} </div>
                                        }

                                        {header.columnDataType === 'JSX' &&
                                        <div> {data[header.column]} </div>
                                        }

                                        {header.columnDataType === 'popoverTrigger' &&
                                        <button> {data[header.column]} </button>
                                        }
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ))}
                    {pagination && <Pagination 
                        pagination={pagination} 
                        changePage={(page)=>{changePage(page)}} 
                        updatePerPage={(perPage)=>{updatePerPage(perPage)}} />}
                </div>
            }
        </Fragment>
    )
}

DataTable.propTypes = {
    tableData: PropTypes.array.isRequired,
    tableHeaders: PropTypes.array.isRequired,
    allFields: PropTypes.array.isRequired,
    columnWidths: PropTypes.object.isRequired,
    columnDataStyles: PropTypes.object
    // element: PropTypes.arrayOf(PropTypes.element).isRequired
  };

export default DataTable
