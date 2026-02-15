import React, { useEffect, useState } from 'react'
import CreateNewCategory from '../../../components/elements/items/CreateNewCategory';
import ModalDialog from '../../../components/Layouts/ModalDialog';
import AppLayout from '../../../components/Layouts/AppLayout';
import FileUpload from '../../../components/elements/form/FileUpload';
import PlusIcon from '../../../components/elements/icons/PlusIcon';
import TextField from '../../../components/elements/form/TextField';
import TrashIcon from '../../../components/elements/icons/TrashIcon';
import { useDispatch, useSelector } from 'react-redux';
import AutocompleteSelect from '../../../components/elements/form/AutocompleteSelect';
import Checkbox from '../../../components/elements/form/Checkbox';
import FormButton from '../../../components/elements/form/FormButton';
import { clearCreatedItem, createItem, fetchItems } from '../../../store/actions/itemsActions';
import { fetchCategories } from '../../../store/actions/categoriesActions';
import CloseIcon from '../../../components/elements/icons/CloseIcon';
import { ERROR, SET_SUCCESS } from '../../../store/types';
import { useNavigate } from 'react-router-dom';

const NewItem = () => {
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
    hasInHouseRecipe: false,
    recipe: [itemInput],
    currentStock: 0,
    noStock: true
    // id: nanoid(10)
  }
  
  const item = {
    sku: '',
    name: '',
    category: '',
    type: '', // sale or store
    variants: [
      itemVariant
    ],
  }

  const storeItem = {
    sku: '',
    name: '',
    barcode: '',
    category: '',
    description: '',
    lowStockAlertCount: '',
    type: 'store',
    stockUnit: '',
    currentStock: 0
  }

  const dispatch = useDispatch()
  const itemsState = useSelector((state => state.items))
  const categoriesState = useSelector((state => state.categories))

  const [activeSection, setActiveSection] = useState('');
  const [itemDetails, setItemDetails] = useState(item);
  // const [loaded, setLoaded] = useState(false);
  const [storeItemDetails, setStoreItemDetails] = useState(storeItem);
  const [validationErrors, setValidationErrors] = useState({});
  // const [categories, setCategories] = useState(null);
  // const [storeItems, setStoreItems] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const addVariant = () => {
    let tempItemDetails = {...itemDetails}
    tempItemDetails.variants.push(itemVariant)
    setItemDetails(tempItemDetails)
  }
  
  const addVariantInput = (variantIndex) => {
    let tempItemDetails = {...itemDetails}
    tempItemDetails.variants[variantIndex].recipe.push(itemInput)
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
  const navigate = useNavigate()
  useEffect(() => {
    if(itemsState.createdItem !== null){
      setStoreItemDetails(storeItem)
      setItemDetails(item)
      dispatch(clearCreatedItem())
      dispatch({
        type: SET_SUCCESS,
        payload: 'Item created successfully!'
      })
      dispatch(fetchItems())
      navigate(`/business/items`)
    }
    
    dispatch(fetchItems('type=store', '', ''))
    dispatch(fetchCategories('', 0, 0))
    return () => {
      
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, itemsState.createdItem, dispatch]);

  const validateForm = () => {
    let errors = {}

    if(!itemDetails.sku || itemDetails.sku === '') {
        errors.sku = true
    }

    if(!itemDetails.name || itemDetails.name === '') {
        errors.name = true
    }

    if(!selectedCategory && selectedCategories.length === 0) {
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
      
      // if(!variant.lowStockAlertCount || variant.lowStockAlertCount === '') {
      //   errors[`${variantIndex}-lowStockAlertCount`] = true
      // }

      if(variant.hasInHouseRecipe) {
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

    console.log(errors)
    
    setValidationErrors(errors)
    return errors
  }

  const [itemCoverImage, setItemCoverImage] = useState(null);

  // const uploadFile = async (file) => {
  //   const headers = new Headers();
  //   headers.append("Authorization",  authHeader().Authorization);
  //   headers.append("x-original-host",  authHeader()["x-original-host"]);
  //   try {

  //       var data = new FormData();
  //       data.append('file', file.file)
  //       dispatch({
  //           type: CREATING_ITEM,
  //           payload: true,
  //       });
  //       const upload = await fetch(`${baseUrl}/files/new`, {
  //           method: "POST",
  //           headers,
  //           body: data,
  //       });
  //       const response = await upload.json();

  //       if(response.status === false) {
  //           dispatch({
  //             type: ERROR,
  //             // payload: error,
  //             error: {response: {data: {
  //                     message: response.message
  //                 }}}
  //           });
  //           dispatch({
  //             type: CREATING_ITEM,
  //             payload: false,
  //           });
  //           return
  //       }
  //       // setTimeout(() => {
  //       return response.data.file
  //       // }, 200);

  //   } catch (error) {
  //       console.log("err",error);
  //       dispatch({
  //           type: ERROR,
  //           // payload: error,
  //           error,
  //       });
  //       dispatch({
  //           type: CREATING_ITEM,
  //           payload: false,
  //       });
  //   }
  // }

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])

  const addCategory = () => {
    if(!selectedCategory) return
    let temp = [...selectedCategories]
    temp.push(selectedCategory)
    setSelectedCategory(null)
    setSelectedCategories(temp)
  }

  const removeCategory = (index) => {
    let temp = [...selectedCategories]
    temp.splice(index, 1)
    setSelectedCategories(temp)
  }

  const createSaleItem = async () => {      
    if (Object.values(validateForm()).includes(true)) {
      dispatch({
        type: ERROR,
        error: {response: {data: {message: 'Form validation error: Please check highlighted fields'}}}
      })
      return
    }
    const categories = selectedCategories.map(cat => cat._id)
    if(selectedCategory){
      categories.push(selectedCategory._id)
    }

    const payload = {...itemDetails, category: categories, type: 'sale'}

    if(itemCoverImage && itemCoverImage !== '') {
      payload.coverImage = itemCoverImage.fileUrl
    }

    try {
      dispatch(createItem(payload))
    } catch (error) {
        console.error('Error creating sale item:', error);
    }
  }
  
  const removeVariant = (index) => {
    let tempItemDetails = {...itemDetails}
    tempItemDetails['variants'].splice((parseInt(index)), 1)

    setItemDetails(itemDetails)
    setRefresh(refresh+1)
  }
  const [creatingNewCategory, setCreatingNewCategory] = useState(false);
  
  return (
    <>
      <AppLayout>
        {
        !itemsState.fetchingItems ? 
          <div className='min-h-screen h-inherit py-2'>
            <div className='w-full bg-white xl:w-10/12 2xl:w-6/12 mx-auto p-1 rounded'>    
              <h1 className='text-3xl font-bold text-ss-dark-gray'>Create a new item</h1>
              <p className='text-sm mb-2 font-medium text-gray-500'>FIll in the form below to create a new item to sell at your establishment.</p>
              <div className='border-t border-gray-300 mt-5'>
                <div className='mt-2 mb-4 w-full'>
                  <FileUpload
                      hasError={false}
                      fieldLabel="Item image"
                      returnFileDetails={(details)=>{
                        // console.log('uploaded file', details)
                        setItemCoverImage(details)}}
                      acceptedFormats={['png', 'jpg', 'jpeg']}
                  />
                </div>

                {selectedCategories.length > 0 && <div className='mt-8 mb-2'>
                  <h3 className='mb-2.5 font-[550] text-[14px] text-gray-600'>Selected Categories</h3>
                  <div className='w-full flex items-center gap-x-2.5 gap-y-2.5 flex-wrap'>
                    {selectedCategories.map((cat, catIndex) => (<div key={catIndex} className='py-1.75 px-3 rounded bg-gray-100 font-[550] text-ss-black text-sm font-space-grotesk flex items-center justify-between gap-x-2.5'>
                      <p>{cat.name}</p>
                      <button onClick={()=>{removeCategory(catIndex)}} className='text-gray-600 cursor-pointer'><CloseIcon className={`w-4 h-4`} /></button>
                    </div>))}
                  </div>
                </div>}

                <div className='mt-4 mb-2 w-full'>
                  <div className='w-full xl:flex items-end justify-between gap-x-1.25'>
                    <div className='w-full lg:w-[70%]'>
                      {categoriesState.categories && categoriesState.categories?.categories?.length > 0 && <AutocompleteSelect
                        selectOptions={categoriesState.categories.categories}
                        inputLabel="Select item category"
                        titleField="name"
                        inputPlaceholder={`Start typing to find and select a category`}
                        displayImage={false}
                        imageField=""
                        preSelected={itemDetails.category || ''}
                        preSelectedLabel={`name`}
                        fieldId="account"
                        hasError={validationErrors.category}
                        returnFieldValue={(value) => { setSelectedCategory(value) }}
                      />}
                    </div>
                    <div className='w-full lg:w-[30%]'>
                      <button onClick={()=>{addCategory()}} className='rounded p-3.75 bg-ss-pale-blue cursor-pointer hover:bg-blue-200 transition duration-200 font-[550] text-ss-blue text-xs w-full'>Add another category</button>
                    </div>
                  </div>
                  <div className='w-full flex flex-row-reverse mt-4'>
                    <button onClick={()=>{setCreatingNewCategory(true)}} className='text-gray-600 font-[550] text-sm flex items-center gap-x-1 hover:text-ss-dark-blue cursor-pointer transition duration-200'>
                      <PlusIcon className="w-5 h-5" /> 
                      Create new category
                    </button>
                  </div>
                </div>

                <div className='my-2'>
                  <TextField
                    inputType="text" 
                    fieldId="item-sku"
                    inputPlaceholder={`Create an SKU for the item`}
                    inputLabel="Item SKU" 
                    preloadValue={itemDetails.sku || ''}
                    hasError={validationErrors && validationErrors.sku} 
                    returnFieldValue={(value)=>{setItemDetails({...itemDetails, ...{sku: value}})}}
                  />
                  <label className='text-sm block mt-2 text-gray-500'>Stock Keeping Unit (SKU) is a unique short code given to your items and their variants to differentiate them from other items</label>
                </div>

                <div className='my-2'>
                  <TextField
                    inputType="text" 
                    inputPlaceholder={`The generic name of the item/product`}
                    fieldId="item-name"
                    inputLabel="Item Name" 
                    preloadValue={itemDetails.name || ''}
                    hasError={validationErrors && validationErrors.name} 
                    returnFieldValue={(value)=>{setItemDetails({...itemDetails, ...{name: value}})}}
                  />
                </div>

                <div className='my-2'>
                    <TextField
                      inputType="text" 
                      fieldId="sale-item-description"
                      inputPlaceholder={`Add a description for the item`}
                      inputLabel="Item Description" 
                      preloadValue={itemDetails?.description || ''}
                      hasError={false} 
                      returnFieldValue={(value)=>{setItemDetails({...itemDetails, ...{description: value}})}}
                    />
                </div>

                <div className='rounded-md p-5 mt-5 bg-gray-50 bg-opacity-60'>
                  <h3 className='text-lg text-gray-800 font-[550]'>Item Variants</h3>
                  <p className='text-sm text-gray-600 mt-1'>Variants are every specification/type of the item. Create a single variant for items with one type (eg size, color, flavour etc)</p>

                  {itemDetails.variants.map((variant, variantIndex)=>(<div key={variantIndex}>
                    {variantIndex > 0 && <div className={`flex flex-row-reverse w-full border-t pt-2 border-black`}>
                      <button onClick={()=>{removeVariant(variantIndex)}} className={`text-gray-400 text-xs flex gap-x-2 hover:text-red-400`}>
                        <TrashIcon className={`w-4 h-4`} />
                        Remove this variant
                      </button> 
                    </div>}
                    <div className='my-2'>
                      <TextField
                        inputType="text" 
                        fieldId={`variant-sku-${variantIndex}`}
                        inputPlaceholder={`Create and SKU for ths variant`}
                        inputLabel="Variant SKU" 
                        preloadValue={variant.sku || ''}
                        hasError={validationErrors && validationErrors[`${variantIndex}-sku`]} 
                        returnFieldValue={(value)=>{updateVariant(variantIndex, 'sku', value)}}
                      />
                      <label className='text-sm block mt-2 text-gray-500'>This will be prefixed with the item's SKU</label>
                    </div>
                    <div className='my-2'>
                      <TextField
                        inputType="text" 
                        fieldId={`variant-barcode-${variantIndex}`}
                        inputPlaceholder={`item's barcode if available`}
                        inputLabel="Barcode" 
                        preloadValue={variant.barcode || ''}
                        hasError={validationErrors && validationErrors[`${variantIndex}-barcode`]} 
                        returnFieldValue={(value)=>{updateVariant(variantIndex, 'barcode', value)}}
                      />
                    </div>
                    <div className='my-2'>
                      <TextField
                        inputType="text" 
                        fieldId={`variant-name-${variantIndex}`}
                        inputLabel="Variant Name" 
                        inputPlaceholder={`The name of the variant (eg: Small size)`}
                        preloadValue={variant.name || ''}
                        hasError={validationErrors && validationErrors[`${variantIndex}-name`]} 
                        returnFieldValue={(value)=>{updateVariant(variantIndex, 'name', value)}}
                      />
                    </div>

                    <div className='my-2'>
                      <TextField
                        inputType="text" 
                        fieldId={`variant-description-${variantIndex}`}
                        inputLabel="Variant Description" 
                        preloadValue={variant.description || ''}
                        inputPlaceholder={`Add a description for the variant`}
                        hasError={false} 
                        returnFieldValue={(value)=>{updateVariant(variantIndex, 'description', value)}}
                      />
                    </div>

                    <div className='my-2 w-full flex justify-between items-center gap-x-8'>
                      <div className='w-full'>
                        <TextField
                          inputType="text" 
                          fieldId={`variant-selling-unit-${variantIndex}`}
                          inputPlaceholder={`In what units are these variant sold? (eg: bottle, box, etc)`}
                          inputLabel="Unit of Sale" 
                          preloadValue={variant.saleUnit || ''}
                          hasError={validationErrors && validationErrors[`${variantIndex}-saleUnit`]} 
                          returnFieldValue={(value)=>{updateVariant(variantIndex, 'saleUnit', value)}}
                        />
                      </div>
                    </div>

                    {/* <div className='w-full my-2'>
                      <NumberField 
                        inputType="number" 
                        fieldId={`low-stock-alert-${variantIndex}`}
                        inputLabel="Low stock alert count" 
                        inputPlaceholder={`How many units will be considered low stock?`}
                        // maxLength="2"
                        hasError={validationErrors && validationErrors[`${variantIndex}-lowStockAlertCount`]} 
                        preloadValue={''}
                        returnFieldValue={(value)=>{updateVariant(variantIndex, 'lowStockAlertCount', value)}}
                      />
                      <label className='text-sm block mt-2 text-gray-500'>You will get an alert whenever the inventory for this item reaches or is below this number of units</label>
                    </div> */}

                    {/* <div className="w-full flex items-start gap-x-1 mt-5 mb-8">
                      <Checkbox 
                        isChecked={itemDetails.variants[variantIndex].noStock}
                        checkboxToggleFunction={()=>{updateVariant(variantIndex, 'noStock', !itemDetails.variants[variantIndex].noStock)}}
                      />
                      <p className='text-sm text-gray-500 w-full'>
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

                    {/* {itemDetails.variants[variantIndex].hasInHouseRecipe && <div className='w-full mb-8 p-5 rounded border'>
                      <h3 className='text-md text-gray-600 font-medium'>Recipe for this variant</h3>
                      <p className='text-sm text-gray-500 mt-1 mb-8'>Everything it takes to create this variant. At the point of adding this variant to your sale inventory, all the inputs that goes into the creation of this items will be subtracted from the store inventory according to the proportions provided here</p>
                      
                      {variant.recipe.map((inputItem, itemIndex)=>(<div key={itemIndex} className={`pt-8 ${itemIndex > 0 && 'border-t border-gray-300'} relative mt-5 pt-12.5`}>

                        {itemIndex > 0 && <button onClick={()=>{removeInput(variantIndex, itemIndex)}} className={`text-gray-500 absolute top-5 right-0 text-xs flex gap-x-2 hover:text-red-400`}>
                          <TrashIcon className={`w-4 h-4`} />
                          Remove this item
                        </button> }
                        {itemsState.items?.items?.length > 0 && 
                          <div className='mt-4 mb-8'>
                            <AutocompleteSelect
                              selectOptions={itemsState?.items?.items}
                              inputLabel="Select input item"
                              inputPlaceholder={`Start typing to select an item`}
                              titleField="name"
                              displayImage={false}
                              imageField=""
                              preSelected={inputItem.storeItem || ''}
                              fieldId="account"
                              hasError={validationErrors && validationErrors[`${variantIndex}-${itemIndex}-storeItem`]}
                              // return id of accounts of the selected option
                              returnFieldValue={(value) => {updateVariantInput(variantIndex, itemIndex, 'item', value._id)}}
                            />
                          </div>
                        }
                        {(!itemsState.items || itemsState?.items?.items?.length === 0) && <div className='mb-8 p-3 rounded border border-red-400 bg-red-50'>
                          <p className='text-sm text-red-400'>Please create some store items first. You need store items as input for variants. <br />
                          <span className='italic'>You can create a store item by selecting the "store item" tab above</span></p>
                        </div>}
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

                      <div className='w-4/12 mt-8'>
                        <button onClick={()=>{addVariantInput(variantIndex)}} className='mb-8 w-full rounded p-3 bg-green-500 text-white text-sm transition duration-200 hover:bg-green-800'>Add another input</button>
                      </div>
                    </div>} */}
                  </div>))}

                  <div className=' w-full lg:w-4/12'>
                    <button onClick={()=>{addVariant()}} className='w-full rounded p-3 bg-ss-dark-blue text-white text-sm transition duration-200 hover:bg-ss-black'>Add another variant</button>
                  </div>
                </div>

                <div className='my-8 w-full'>
                  <FormButton buttonLabel="Create item" buttonAction={()=>{createSaleItem()}} processing={itemsState.creatingItem} /> 
                </div>
              </div>


            </div>
          </div>
        :
          <Loader />
        }
      </AppLayout>

      <ModalDialog
        shown={creatingNewCategory} 
        closeFunction={()=>{setCreatingNewCategory(false)}} 
        dialogTitle='Create a category'
        dialogIntro={`Create a category for store or sale items`}
        maxWidthClass='max-w-lg'
      >
        <CreateNewCategory 
          closeNewCategory={()=>{setCreatingNewCategory(false)}} 
          reload={()=>{setRefresh(refresh+1)}}
        />
      </ModalDialog>
    </>
  )
}

export default NewItem