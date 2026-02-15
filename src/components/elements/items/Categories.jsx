import React, { useEffect, useState } from 'react'
import CategoryCard from './CategoryCard';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon } from '@heroicons/react/solid';
import ModalLayout from '../../Layout/ModalLayout';
import CreateNewCategory from './CreateNewCategory';

const Categories = () => {
    const dataState = useSelector((state => state.syncData))
    const dispatch = useDispatch()
    const [refresh, setRefresh] = useState(0);
    const [creatingNewCategory, setCreatingNewCategory] = useState(false);

    useEffect(() => {
      dispatch(pullData('item-category'))
    
      return () => {
        
      };
    }, [refresh]);
    return (
        <>
            <div className='relative grid lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1 mb-5'>
                {dataState.pulledData !== null && dataState.pulledData?.length > 0 && dataState.pulledData.map((category, categoryIndex) => (
                <CategoryCard 
                    selectCategory={()=>{setActiveCategory(categoryIndex)}} 
                    category={category.document} 
                    itemsCount={items.filter((item)=>{return (item?.category?._id === category?._id || item?.category === category?.id)})?.length}
                    key={categoryIndex} 
                    index={categoryIndex} 
                    activeCategory={activeCategory} 
                    deleteCategory={()=>{deleteCategory(category._id, category.name)}}
                />
                ))}
                <div onClick={()=>{setCreatingNewCategory(true)}} className={`cursor-pointer w-full rounded p-6 transition duration-200 bg-gray-200 hover:bg-gray-300`}> 
                    <div className="flex flex-col justify-between gap-y-12">
                        <p className={`font-medium text-gray-600`}><PlusIcon className={`w-7 h-7`} /> </p>
                        <p className={`font-thin text-sm text-gray-600`}>Create new category</p>
                    </div>
                </div>
            </div>

            <ModalLayout
                isOpen={creatingNewCategory} 
                closeModal={()=>{setCreatingNewCategory(false)}} 
                dialogTitle='Create a category'
                dialogIntro={`Create a category for store or sale items`}
                maxWidthClass='max-w-xl'
            >
                <CreateNewCategory 
                closeNewCategory={()=>{setCreatingNewCategory(false)}} 
                reload={()=>{setRefresh(refresh+1)}}
                />
            </ModalLayout>
        </>

    )
}

export default Categories