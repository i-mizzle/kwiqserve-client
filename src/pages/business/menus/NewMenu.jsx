import React, { useEffect, useState } from 'react'
import AppLayout from '../../../components/Layouts/AppLayout'
import TextField from '../../../components/elements/form/TextField'
import AutocompleteSelect from '../../../components/elements/form/AutocompleteSelect'
import { Switch } from '@headlessui/react'
import NumberField from '../../../components/elements/form/NumberField'
import TrashIcon from '../../../components/elements/icons/TrashIcon'
import Checkbox from '../../../components/elements/form/Checkbox'
import FormButton from '../../../components/elements/form/FormButton'
import EmptyState from '../../../components/elements/EmptyState'
import { useDispatch, useSelector } from 'react-redux'
import { clearCreatedMenu, createMenu, fetchMenus } from '../../../store/actions/menusActions'
import { fetchItems } from '../../../store/actions/itemsActions'
import { useNavigate } from 'react-router-dom'
import { SET_SUCCESS } from '../../../store/types'
import Loader from '../../../components/elements/Loader'

const NewMenu = () => {
  const menuItem = {
    itemSku: '',
    variantSku: '',
    displayName: '',
    itemId: '',
    inStock: true,
    price: 0
  }
  
  const menu = {
    name: "",
    description: "",
    items: [
      menuItem
    ]
  }
  const dispatch = useDispatch()
  // const statsState = useSelector((state => state.stats))
  // const dataState = useSelector((state => state.syncData))
  const itemsState = useSelector((state => state.items))
  const menusState = useSelector((state => state.menus))

  const [menuDetails, setMenuDetails] = useState(menu);
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate()
  useEffect(() => {
    if(menusState.createdMenu !== null){
      setMenuDetails(menu)
      dispatch(clearCreatedMenu())
      dispatch({
        type: SET_SUCCESS,
        payload: 'Menu created successfully!'
      })
      // dispatch(fetchMenus())
      navigate(`/business/menus`)
    }

    dispatch(fetchItems('', 0, 0))

    return () => {
      
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, menusState.createdMenu, dispatch]);

  const addMenuItem = () => {
    let tempMenuDetails = {...menuDetails}
    tempMenuDetails.items.push(menuItem)
    setMenuDetails(tempMenuDetails)
  }

  const removeMenuItem = (index) => {
    let tempMenuDetails = {...menuDetails}
    tempMenuDetails.items.splice((parseInt(index)), 1)
    setMenuDetails(tempMenuDetails)
    setRefresh(refresh+1)
  }

  const selectMenuItem = (itemIndex, newItem) => {
    let tempMenuDetails = {...menuDetails}
    tempMenuDetails.items[itemIndex].itemSku = newItem.itemSku
    tempMenuDetails.items[itemIndex].variantSku = newItem.variantSku
    tempMenuDetails.items[itemIndex].displayName = newItem.displayName
    tempMenuDetails.items[itemIndex].item = newItem.itemId
    tempMenuDetails.items[itemIndex].parentItem = newItem.parentItem
    tempMenuDetails.items[itemIndex].parentItemCategories = newItem.parentItemCategories.map(cat=> cat._id)
    setMenuDetails(tempMenuDetails)
  }

  const updateMenuPrice = (itemIndex, value) => {
    let tempMenuDetails = {...menuDetails}
    tempMenuDetails.items[itemIndex].price = value
    setMenuDetails(tempMenuDetails)
  }

  const updateItemStock = (itemIndex, value) => {
    let tempMenuDetails = {...menuDetails}
    tempMenuDetails.items[itemIndex].inStock = value
    setMenuDetails(tempMenuDetails)
  }
  
  const [isOnlineMenu, setIsOnlineMenu] = useState(false);
  const [validationErrors, setValidationErrors] = useState(null);

  const validateForm = () => {
    let errors = {}

    if(!menuDetails.name || menuDetails.name === '') {
        errors.name = true
    }

    menuDetails.items.forEach((item, itemIndex)=>{
      if(!item.item || item.item === '') {
        errors[`${itemIndex}-item`] = true
      }
      if(item.fixedPricing === true && (!item.price || item.price === '')) {
        errors[`${itemIndex}-price`] = true
      }
    })

    setValidationErrors(errors)
    return errors
  }

  const createNewMenu = async () => {
      if (Object.values(validateForm()).includes(true)) {
        return
      }
  
      try {
        const data = {
          ...menuDetails, 
          eCommerceMenu: isOnlineMenu
        }
        // return
        dispatch(createMenu(data))
      } catch (error) {
        console.log('Error creating menu: ', error)
      }
  }

  const itemVariants =  () => {
    if(!itemsState.items){
      return []
    }

    const saleItems = itemsState?.items?.items
    const saleItemVariants = []
    saleItems?.forEach((item)=>{
      item.variants.forEach((variant)=>{saleItemVariants.push({
          displayName: `${item.name} - ${variant.name}`, 
          // displayName: `(${variant.sku}-${item.sku}) ${item.name} - ${variant.name}`, 
          itemSku: item.sku, 
          variantSku: variant.sku,
          // variantId: variant.id,
          itemId: variant._id,
          parentItem: item._id,
          parentItemCategories: item.category.map(cat => cat)
        }
      )})
    })

    return saleItemVariants
  }      
  return (
    <AppLayout>
      {itemsState.fetchingItems ? 
        <Loader />
        :
        <div className='min-h-screen h-inherit py-2'>
          {itemsState.items?.items?.length > 0 ? <div className='w-full lg:w-10/12 xl:w-6/12 mx-auto p-1 bg-white '>
              <h3 className='text-3xl text-gray-800 font-bold'>Create a new price card</h3>
              <p className='text-sm text-gray-600 mt-1 mb-4'>Fill the form below to create a new price card</p>
              <div>
                  <div className='my-2'>
                    <TextField
                      inputType="text" 
                      fieldId="menu-name"
                      inputLabel="Price Card Name" 
                      inputPlaceholder={`Give the price card a name`}
                      preloadValue={menuDetails.name || ''}
                      hasError={validationErrors && validationErrors.name} 
                      returnFieldValue={(value)=>{setMenuDetails({...menuDetails, ...{name: value}})}}
                    />
                  </div>

                  <div className='my-2'>
                    <TextField
                      inputType="text" 
                      fieldId="store-item-description"
                      inputLabel="Description" 
                      inputPlaceholder={`Add a description`}
                      preloadValue={menuDetails.description || ''}
                      hasError={false} 
                      returnFieldValue={(value)=>{setMenuDetails({...menuDetails, ...{description: value}})}}
                    />
                  </div>

                  <div className='p-5 border border-gray-200 rounded bg-gray-50 mt-5'>
                      <h3 className='text-lg text-gray-800 font-[550]'>Menu Items</h3>
                      <p className='text-sm text-gray-600 mt-1'>Select items below and attach prices for them</p>
                      {/* <p className='text-sm text-gray-600 mt-1'>Note: <span className='font-[550]'>Fixed price</span> items cannot be changed during order creation, if the prices are not fixed, they will have to be inputted during order creation.</p> */}
                      {itemsState.items !== null && itemsState.items?.items?.length > 0 && menuDetails.items.map((item, itemIndex) => (
                        <div key={itemIndex} className='w-full my-4'>
                          <div className='lg:flex items-center justify-between gap-x-2'>
                            <div className='w-full lg:w-6/12'>
                              {itemsState.items !== null && 
                                <AutocompleteSelect
                                  selectOptions={itemVariants()}
                                  inputLabel="Select item"
                                  titleField="displayName"
                                  displayImage={false}
                                  imageField=""
                                  preSelected={item}
                                  preSelectedLabel={'displayName'}
                                  fieldId="menu-item"
                                  inputPlaceholder={`Click to select or start typing to search`}
                                  hasError={validationErrors && validationErrors[`${itemIndex}-item`]}
                                  returnFieldValue={(value) => {
                                    selectMenuItem(itemIndex, value);
                                  }}
                                />
                              }
                            </div>
                            <div className='w-full lg:w-6/12'>
                              {/*  */}
                              <div className='w-full'>
                                {<NumberField 
                                  inputType="number" 
                                  fieldId={`menu-item-price-${itemIndex}`}
                                  inputLabel="Price (N)" 
                                  inputPlaceholder={`How much will you sell this item?`}
                                  hasError={validationErrors && validationErrors[`${itemIndex}-price`]} 
                                  preloadValue={item.price || ''}
                                  returnFieldValue={(value)=>{updateMenuPrice(itemIndex, value)}}
                                />}
                              </div>
                            </div>
                            <div className='w-12.5'>
                              {itemIndex > 0 && <button onClick={()=>{removeMenuItem(itemIndex)}} className={`text-gray-400 text-xs flex gap-x-2 hover:text-red-400`}>
                                  <TrashIcon className={`w-5 h-5`} />
                              </button>}
                            </div>
                          </div>

                          <div className='w-[92%] flex items-start justify-between gap-x-5 mt-4 p-3 bg-gray-100'>
                            <div>
                              <p className='font-family-bricolage-grotesque text-gray-600 font-[550]'>Item in stock</p>
                              <p className='text-sm text-gray-500'>Toggle this switch on if this item currently in stock</p>
                            </div>
                            <Switch
                              checked={item.inStock}
                              onChange={()=>{updateItemStock(itemIndex, !item.inStock)}}
                              className={`${
                                  item.inStock ? 'bg-ss-dark-blue' : 'bg-gray-200'
                              } relative inline-flex items-center h-5 rounded-full w-10 mt-2`}
                              >
                              <span
                                className={`transform transition ease-in-out duration-200 ${
                                  item.inStock ? 'translate-x-6 bg-ss-pale-blue' : 'translate-x-1 bg-white'
                                } inline-block w-3 h-3 transform bg-white rounded-full`}
                              />
                            </Switch>
                          </div>
                        </div>
                      ))}

                      <div className='w-full xl:w-4/12 mt-8'>
                          <button onClick={()=>{addMenuItem()}} className='mb-8 w-full rounded p-3 bg-ss-dark-blue text-white text-sm transition duration-200 hover:bg-ss-dark-gray cursor-pointer'>Add another item</button>
                      </div>
                  </div>

                  <div className='my-8 w-full'>
                    <FormButton buttonLabel="Create menu" buttonAction={()=>{createNewMenu()}} processing={menusState.creatingMenu} /> 
                  </div>
              </div>
          </div>
          :
          <div className='w-6/12 mx-auto pt-12'>
            <EmptyState 
                emptyStateText={`You need items created for your business before you can create menus. Please navigate to items in the header to create some items first.`} 
                emptyStateTitle={`No items found`} 
            />
          </div>
          }
        </div>
      }
    </AppLayout>
  )
}

export default NewMenu