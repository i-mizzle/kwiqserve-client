import React, { useEffect, useState } from 'react'
import AppLayout from '../../../components/Layouts/AppLayout'
import Loader from '../../../components/elements/Loader'
import FileUpload from '../../../components/elements/form/FileUpload'
import ModalDialog from '../../../components/Layouts/ModalDialog'
import CreateNewCategory from '../../../components/elements/items/CreateNewCategory'
import ConfirmationBox from '../../../components/Layouts/ConfirmationBox'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authHeader, baseUrl, businessDetails } from '../../../utils'
import axios from 'axios'
import { SET_SUCCESS } from '../../../store/types'
import { fetchItems } from '../../../store/actions/itemsActions'
import { fetchCategories } from '../../../store/actions/categoriesActions'
import TrashIcon from '../../../components/elements/icons/TrashIcon'
import TextField from '../../../components/elements/form/TextField'
import AutocompleteSelect from '../../../components/elements/form/AutocompleteSelect'
import NumberField from '../../../components/elements/form/NumberField'
import FormButton from '../../../components/elements/form/FormButton'

const ItemDetails = () => {
  const { itemId } = useParams()
  const navigate = useNavigate()
  // const [activeSection, setActiveSection] = useState('sale');
  const [itemDetails, setItemDetails] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [creatingNewCategory, setCreatingNewCategory] = useState(false);
  const [storeItems] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const dispatch = useDispatch()
  // const dataState = useSelector((state => state.syncData))
  const categoriesState = useSelector((state => state.categories))
  const itemsState = useSelector((state => state.items))
  

  const itemInput = {
      storeItem: '',
      measure: ''
  }

  const itemVariant = {
      sku: '',
      name: '',
      barcode: '',
      description: '',
      saleUnit: '',
      lowStockAlertCount: '',
      // salePrice: '',
      input: [itemInput],
      currentStock: 0,
      // id: nanoid(10)
  }

  const addVariant = () => {
      let tempItemDetails = {...itemDetails}
      tempItemDetails.variants.push(itemVariant)
      setItemDetails(tempItemDetails)
  }
  
  const addVariantInput = (variantIndex) => {
      let tempItemDetails = {...itemDetails}
      if(!tempItemDetails.variants[variantIndex].recipe) {
          tempItemDetails.variants[variantIndex].recipe = [itemInput]
      } else {
          tempItemDetails.variants[variantIndex].recipe.push(itemInput)
      }
      setItemDetails(tempItemDetails)
  }

  const updateVariant = (variantIndex, field, value) => {
      let tempItemDetails = {...itemDetails}
      tempItemDetails.variants[variantIndex][field] = value
      setItemDetails(tempItemDetails)
  }

  const updateVariantInput = (variantIndex, inputIndex, field, value) => {
    let tempItemDetails = {...itemDetails}
    tempItemDetails.variants[variantIndex].recipe[inputIndex][field] = value
    setItemDetails(tempItemDetails)
  }

  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
      const fetchItem = async () => {
          try {
              setLoaded(false)
              const headers = authHeader()
              const business = await businessDetails()
              const response = await axios.get(`${baseUrl}/items/${itemId}/${business._id}?expand=variants&expand=variants.recipe.item`, { headers })
              setItemDetails(response.data.data)

              setTimeout(() => {
                  setLoaded(true)
              }, 50);
          } catch (error) {
              console.error('Error fetching documents:', error);
          }
      };

      if(itemsState.deletedItem !== null){
          dispatch(clearDeletedItem())
          dispatch({
            type: SET_SUCCESS,
            payload: 'Item deleted successfully!'
          })
          navigate('/user/items')
      } else {
          fetchItem()
      }

      dispatch(fetchItems('type=store', 0, 0))
      dispatch(fetchCategories())
      // dispatch(fetchReviews(`item=${itemId}`, 1, 10))

      // fetchDocuments();
    return () => {
      
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, itemsState.deletedItem, dispatch, itemId]);

  const validateForm = () => {
    let errors = {}

    if(!itemDetails.sku || itemDetails.sku === '') {
        errors.sku = true
    }

    if(!itemDetails.name || itemDetails.name === '') {
        errors.name = true
    }

    if(!itemDetails.category || itemDetails.category === '') {
        errors.category = true
    }
    
    itemDetails.variants.forEach((variant, variantIndex)=> {
      if(!variant.sku || variant.sku === '') {
        errors[`${variantIndex}-sku`] = true
      }
      
      if(!variant.name || variant.name === '') {
        errors[`${variantIndex}-name`] = true
      }
      
      if(!variant.saleUnit || variant.saleUnit === '') {
        errors[`${variantIndex}-saleUnit`] = true
      }
      
      if(!variant.lowStockAlertCount || variant.lowStockAlertCount === '') {
        errors[`${variantIndex}-lowStockAlertCount`] = true
      }
      
      if(variant.hasInHouseRecipe){
          variant.recipe.forEach((inputItem, inputItemIndex)=>{
              if(!inputItem.item || inputItem.item === '') {
                  errors[`${variantIndex}-${inputItemIndex}-storeItem`] = true
              }
              
              if(!inputItem.measure || inputItem.measure === '') {
                  errors[`${variantIndex}-${inputItemIndex}-measure`] = true
              }
              
              })
          }
      
    })
    
    setValidationErrors(errors)
    return errors
  }

  const [updating, setUpdating] = useState(false);

  const uploadFile = async (file) => {
      const headers = new Headers();
      headers.append("Authorization",  authHeader().Authorization);
      try {
  
          var data = new FormData();
          data.append('file', file.file)
          dispatch({
              type: UPDATING_ITEM,
              payload: true,
          });
          const upload = await fetch(`${baseUrl}/files/new`, {
              method: "POST",
              headers,
              body: data,
          });
          const response = await upload.json();

          if(response.status === false) {
              dispatch({
                type: ERROR,
                // payload: error,
                error: {response: {data: {
                        message: response.message
                    }}}
              });
              dispatch({
                type: UPDATING_ITEM,
                payload: false,
              });
              return
          }
          // setTimeout(() => {
          return response.data.file
          // }, 200);
  
      } catch (error) {
          console.log("err",error);
          dispatch({
              type: ERROR,
              // payload: error,
              error,
          });
          dispatch({
              type: UPDATING_ITEM,
              payload: false,
          });
      }
    }


  const updateSaleItem = async () => {      
      if (Object.values(validateForm()).includes(true)) {
          return
      }
  
      try {            
          const headers = authHeader()

          const payload = itemDetails
          if(itemCoverImage && itemCoverImage !== '') {
              payload.coverImage = await uploadFile(itemCoverImage)
          }

          setUpdating(true)
          await axios.patch(`${baseUrl}/items/${itemId}`, payload, { headers })

          dispatch({
              type: SUCCESS,
              payload: 'Successfully Updated Item'
          })
          setUpdating(false)
          
          
          // setItemDetails(item)
          // setUpdateSuccess('Item updated successfully')
      } catch (error) {
          setUpdating(false)
          setUpdateError('Error occurred: ' + error)
          console.error('Error creating category:', error);
      }
  }
  
  const [storeValidationErrors, setStoreValidationErrors] = useState({});
  const validateStoreItemForm = () => {
    let errors = {}

    if(!itemDetails.name || itemDetails.name === '') {
        errors.name = true
    }

    if(!itemDetails.category || itemDetails.category === '') {
        errors.category = true
    }

    if(!itemDetails.stockUnit || itemDetails.stockUnit === '') {
        errors.stockUnit = true
    }

    if(!itemDetails.lowStockAlertCount || itemDetails.lowStockAlertCount === '') {
        errors.lowStockAlertCount = true
    }
    
    setStoreValidationErrors(errors)
    return errors
  }

  const updateStoreItem = async () => {      
      if (Object.values(validateStoreItemForm()).includes(true)) {
          return
      }
  
      try {
          const headers = authHeader()

          const payload = itemDetails
          setUpdating(true)
          await axios.patch(`${baseUrl}/items/${itemId}`, payload, { headers })

          dispatch({
              type: SUCCESS,
              payload: 'Successfully Updated Item'
          })
          setUpdating(false)
      } catch (error) {
          setUpdateError('Error occurred: ' + error)
          console.error('Error creating category:', error);
      }
  }

  const removeInput = (variantIndex, inputIndex) => {
      let tempItemDetails = {...itemDetails}
      tempItemDetails['variants'][variantIndex]['input'].splice((parseInt(inputIndex)), 1)
    
      setItemDetails(tempItemDetails)
      // setRefresh(refresh+1)
  }
  
  const removeVariant = (index) => {    
      let tempItemDetails = {...itemDetails}
      tempItemDetails['variants'].splice(index, 1)
  
      setItemDetails(tempItemDetails)
      // setRefresh(refresh+1)
  }

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationMessage, setDeleteConfirmationMessage] = useState(null);
  const doDeleteItem = async () => {
      setDeleteConfirmationMessage(`You are about to permanently delete the item "${itemDetails.name}". This action cannot be reversed. Please confirm.`)
      setTimeout(() => {
          setShowDeleteConfirmation(true)
      }, 100);
  }

  const deleteAfterConfirm = () => {
      dispatch(deleteItem(itemId))
      setShowDeleteConfirmation(false)
      setTimeout(() => {
          setDeleteConfirmationMessage(null)
      }, 50);
  }

  const findCategoryIndex = (id) => {
      return categoriesState?.categories?.categories?.findIndex(cat => cat._id === id);
  };

  const [itemCoverImage, setItemCoverImage] = useState(null);
  const [changingImage, setChangingImage] = useState(false);
  
  return (
    <AppLayout>
      {loaded ? <>
            {<div className='min-h-screen h-inherit p-5'>
                
                
                <div className={`w-full flex flex-row-reverse`}>
                    {itemsState.deletingItem ? 
                    <span className='flex items-center gap-x-3 text-gray-400'>
                        <InlinePreloader />
                        Deleting item...
                    </span>
                    :
                    <button onClick={()=>{doDeleteItem()}} className={`text-red-600 font-[550] text-sm flex gap-x-2 hover:text-red-800`}>
                        <TrashIcon className={`w-5 h-5`} />
                        Delete this item
                    </button> }
                </div>

                <div className='mx-auto xl:flex items-start gap-x-5'>
                    <div className={`w-full bg-white xl:w-6/12 p-6.25 xl:p-10 rounded mt-2.5 mx-auto`}>
                        {<div className='w-full mt-6'>
                            {itemDetails.coverImage && !changingImage && 
                            <div className='relative w-full'>
                                <div style={{
                                    height: '300px',
                                    backgroundImage: `url(" ${itemDetails.coverImage} ")`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center center',
                                    backgroundRepeat: 'none'
                                    }}>
                                </div>
                                <div className='w-full flex flex-row-reverse'>
                                    <button onClick={()=>{setChangingImage(true)}} className='text-ss-dark-blue hover:text-black transition duration-200 font-[550] text-sm'>Change image</button>
                                </div>
                            </div>
                            }

                            {(!itemDetails.coverImage || itemDetails.coverImage === '' || changingImage) &&
                                <div className='my-8 w-full'>
                                    <FileUpload
                                        hasError={false}
                                        fieldLabel="Item image"
                                        returnFileDetails={(details)=>{setItemCoverImage(details)}}
                                        acceptedFormats={['png', 'jpg', 'jpeg']}
                                    />
                                    {changingImage && <div className='w-full flex flex-row-reverse mt-3'>
                                        <button onClick={()=>{setChangingImage(false)}} className='text-ss-dark-blue block hover:text-ss-black transition duration-200 font-medium text-sm'>Cancel image change</button>
                                    </div>}
                                </div>
                            }
                        </div>}

                        {<>
                        <div className='my-8'>
                            {categoriesState?.categories !== null && categoriesState?.categories?.categories?.length > 0 && <AutocompleteSelect
                                selectOptions={categoriesState?.categories?.categories.filter((cat, catIndex) => {return cat.type === 'sale'})}
                                inputLabel="Select item category"
                                titleField="name"
                                displayImage={false}
                                imageField=""
                                preSelected={categoriesState?.categories?.categories[findCategoryIndex(itemDetails.category)] || ''}
                                preSelectedLabel={`name`}
                                fieldId="account"
                                hasError={storeValidationErrors && storeValidationErrors.category}
                                // return id of accounts of the selected option
                                returnFieldValue={(value) => { setItemDetails({ ...itemDetails, ...{ category: value._id } }) }}
                            />}
                            {/* <div className='w-full flex flex-row-reverse mt-4'>
                            <button onClick={()=>{setCreatingNewCategory(true)}} className='text-ss-dark-blue text-sm flex items-center gap-x-1 hover:text-mms-red transition duration-200'>
                                <PlusIcon className="w-5 h-5" /> 
                                Create new category
                            </button>
                            </div> */}
                        </div>
            
                        <div className='my-8'>
                            <TextField
                                inputType="text" 
                                fieldId="item-sku"
                                inputLabel="Item SKU" 
                                preloadValue={itemDetails.sku || ''}
                                hasError={validationErrors && validationErrors.sku} 
                                returnFieldValue={(value)=>{setItemDetails({...itemDetails, ...{sku: value}})}}
                            />
                            <label className='text-sm block mt-2 text-gray-500'>Stock Keeping Unit (SKU) is a unique short code given to your items and their variants to differentiate them from other items</label>
                        </div>
            
                        <div className='my-8'>
                            <TextField
                            inputType="text" 
                            fieldId="item-name"
                            inputLabel="Item Name" 
                            preloadValue={itemDetails.name || ''}
                            hasError={validationErrors && validationErrors.name} 
                            returnFieldValue={(value)=>{setItemDetails({...itemDetails, ...{name: value}})}}
                            />
                        </div>

                        <div className='my-8'>
                            <TextField
                                inputType="text" 
                                fieldId="sale-item-description"
                                inputLabel="Item Description" 
                                preloadValue={itemDetails?.description || ''}
                                hasError={false} 
                                returnFieldValue={(value)=>{setItemDetails({...itemDetails, ...{description: value}})}}
                            />
                        </div>
            
                        <div className='border border-gray-200 rounded-md p-5 bg-gray-50 bg-opacity-20'>
                            <p className='text-lg text-gray-500 font-thin'>Item Variants</p>
                            <p className='text-sm text-gray-500 mt-1'>Variants are every specification/type of the item. Create a single variant for items with one type (eg size, color, flavour etc)</p>
                            
            
                            {itemDetails.variants.map((variant, variantIndex)=>(<div key={variantIndex}>

                                {variantIndex > 0 && <div className={`flex flex-row-reverse`}>
                                    <button onClick={()=>{removeVariant(variantIndex)}} className={`text-gray-400 text-xs flex gap-x-2 hover:text-red-400`}>
                                        <TrashIcon className={`w-4 h-4`} />
                                        Remove this variant
                                    </button> 
                                </div>}
                            <div className='my-8'>
                                <TextField
                                    inputType="text" 
                                    fieldId={`variant-sku-${variantIndex}`}
                                    inputLabel="Variant SKU" 
                                    preloadValue={variant.sku || ''}
                                    hasError={validationErrors && validationErrors[`${variantIndex}-sku`]} 
                                    returnFieldValue={(value)=>{updateVariant(variantIndex, 'sku', value)}}
                                />
                                <label className='text-sm block mt-2 text-gray-500'>This will be prefixed with the item's SKU</label>
                            </div>
                            <div className='my-8'>
                                <TextField
                                    inputType="text" 
                                    fieldId={`variant-barcode-${variantIndex}`}
                                    inputLabel="Variant Barcode" 
                                    inputPlaceholder={`Barcode for this variant`}
                                    preloadValue={variant.barcode || ''}
                                    hasError={validationErrors && validationErrors[`${variantIndex}-barcode`]} 
                                    returnFieldValue={(value)=>{updateVariant(variantIndex, 'barcode', value)}}
                                />
                            </div>
                            <div className='my-8'>
                                <TextField
                                    inputType="text" 
                                    fieldId={`variant-name-${variantIndex}`}
                                    inputLabel="Variant Name" 
                                    preloadValue={variant.name || ''}
                                    hasError={validationErrors && validationErrors[`${variantIndex}-name`]} 
                                    returnFieldValue={(value)=>{updateVariant(variantIndex, 'name', value)}}
                                />
                            </div>
            
                            <div className='my-8'>
                                <TextField
                                    inputType="text" 
                                    fieldId={`variant-description-${variantIndex}`}
                                    inputLabel="Variant Description" 
                                    preloadValue={variant.description || ''}
                                    hasError={false} 
                                    returnFieldValue={(value)=>{updateVariant(variantIndex, 'description', value)}}
                                />
                            </div>
            
                            <div className='my-8 w-full flex justify-between items-center gap-x-8'>
                                <div className='w-full'>
                                <TextField
                                    inputType="text" 
                                    fieldId={`variant-selling-unit-${variantIndex}`}
                                    inputLabel="Unit of Sale" 
                                    preloadValue={variant.saleUnit || ''}
                                    hasError={validationErrors && validationErrors[`${variantIndex}-saleUnit`]} 
                                    returnFieldValue={(value)=>{updateVariant(variantIndex, 'saleUnit', value)}}
                                />
                                </div>
                            </div>
            
                            {/* <div claa */}

                            {/* <div className="w-full flex items-start gap-x-1 mt-5 mb-8">
                                <Checkbox 
                                isChecked={itemDetails.variants[variantIndex].noStock}
                                checkboxToggleFunction={()=>{updateVariant(variantIndex, 'noStock', !itemDetails.variants[variantIndex].noStock)}}
                                />
                                <p className='text-sm text-gray-500'>
                                <span className='font-medium'>Is this a no-stock item?</span>
                                <br />
                                No-stock items will not require a positive inventory to sell.
                                </p>
                            </div> */}

                            {/* <div className="w-full flex items-start gap-x-1 mt-5 mb-8">
                                <Checkbox 
                                isChecked={itemDetails.variants[variantIndex].hasInHouseRecipe}
                                checkboxToggleFunction={()=>{updateVariant(variantIndex, 'hasInHouseRecipe', !itemDetails.variants[variantIndex].hasInHouseRecipe)}}
                                />
                  
                                <p className='text-sm text-gray-500'>
                                <span className='font-medium'>Does this variant require an in-house recipe?</span>
                                <br />
                                This is for items that are produced in-house and require other items from the inventory for its production.
                                </p>
                            </div> */}


                            {itemDetails.variants[variantIndex].hasInHouseRecipe && <div className='w-full mb-8 p-5 rounded border'>
                                <p className='text-md text-gray-500 font-medium'>Recipe for this variant</p>
                                <p className='text-sm text-gray-500 mt-1 mb-8'>Everything it takes to create this variant. At the point of adding this variant to your sale inventory, all the inputs that goes into the creation of this items will be subtracted from the store inventory according to the proportions provided here</p>
                                
                                {variant?.recipe?.map((inputItem, itemIndex)=>(<div key={itemIndex} className={`pt-8 ${itemIndex > 0 && 'border-t border-gray-300'}`}>
                                    {itemIndex > 0 && <div className={`flex flex-row-reverse`}>
                                        <button onClick={()=>{removeInput(variantIndex, itemIndex)}} className={`text-gray-400 text-xs flex gap-x-2 hover:text-red-400`}>
                                            <TrashIcon className={`w-4 h-4`} />
                                            Remove this item
                                        </button> 
                                    </div>}
                                {itemsState.items !== null && itemsState.items?.items?.length > 0 && 
                                    <div className='mt-4 mb-8'>
                                        <AutocompleteSelect
                                            selectOptions={itemsState?.items?.items}
                                            inputLabel="Select input item"
                                            titleField="name"
                                            displayImage={false}
                                            imageField=""
                                            preSelected={inputItem.item || ''}
                                            preSelectedLabel={`name`}
                                            fieldId={`${variantIndex}-${itemIndex}-storeItem`}
                                            hasError={validationErrors && validationErrors[`${variantIndex}-${itemIndex}-storeItem`]}
                                            // return id of accounts of the selected option
                                            returnFieldValue={(value) => {updateVariantInput(variantIndex, itemIndex, 'item', value._id)}}
                                        />
                                    </div>
                                }
                                {(storeItems === null || storeItems?.length) === 0 && 
                                    <div className='mb-8 p-3 rounded border border-red-400'>
                                        <p className='text-sm text-red-400'>Please create some store items first. You need store items as input for variants. <br />
                                        <span className='italic'>You can create a store item by selecting the "store item" tab above</span></p>
                                    </div>
                                }
                                <div className='w-full'>
                                    <NumberField 
                                        inputType="number" 
                                        fieldId={`number-of-input-units-${variantIndex}-${itemIndex}`}
                                        inputLabel="Input measure" 
                                        // maxLength="2"
                                        hasError={validationErrors && validationErrors[`${variantIndex}-${itemIndex}-measure`]} 
                                        preloadValue={inputItem.measure || ''}
                                        returnFieldValue={(value)=>{updateVariantInput(variantIndex, itemIndex, 'measure', value)}}
                                    />
                                    <label className='text-sm block mt-2 text-gray-500'>How many units of the item selected are required to make this variant. The input must be in the same unit as that of the store item (eg: if store item is in kg, this input must be in kg)</label>
                                </div>
                                </div>))}
            
                                <div className='w-full xl:w-4/12 mt-8'>
                                <button onClick={()=>{addVariantInput(variantIndex)}} className='mb-8 cursor-pointer w-full rounded p-3 bg-ss-dark-blue text-white text-sm transition duration-200 hover:bg-mms-red'>Add another input</button>
                                </div>
                            </div>}
                            </div>))}
            
                            <div className='w-full xl:w-4/12'>
                            <button onClick={()=>{addVariant()}} className='w-full cursor-pointer rounded p-3 bg-ss-dark-blue text-white text-sm transition duration-200 hover:bg-mms-red'>Add another variant</button>
                            </div>
                        </div>
            
                        <div className='my-8 w-full'>
                            <FormButton buttonLabel="Save updates to sale item" buttonAction={()=>{updateSaleItem()}} processing={updating} /> 
                        </div>
                        </>}
            
            
                    </div>

                    
                </div>
            </div>}    
            <ModalDialog
                shown={creatingNewCategory} 
                closeModal={()=>{setCreatingNewCategory(false)}} 
                dialogTitle='Create a category'
                // dialogIntro={`Create a category for store or sale items`}
                maxWidthClass='max-w-md'
            >
                <CreateNewCategory 
                    closeNewCategory={()=>{setCreatingNewCategory(false)}} 
                    reload={()=>{setRefresh(refresh+1)}}
                />
            </ModalDialog>

            {deleteConfirmationMessage && <ConfirmationBox
                isOpen={showDeleteConfirmation} 
                closeModal={()=>{setShowDeleteConfirmation(false)}} 
                confirmButtonAction={()=>{deleteAfterConfirm()}}                          
            >
                <p>{deleteConfirmationMessage}</p>
            </ConfirmationBox>}
        </>
        : 
        <Loader />}
    </AppLayout>
  )
}

export default ItemDetails