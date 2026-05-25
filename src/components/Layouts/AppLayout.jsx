import React, { Fragment } from 'react'
import AdminHeader from '../partials/AdminHeader'
import { businessDetails } from '../../utils'
import PendingOrdersFloater from '../elements/PendingOrdersFloater'
import { usePushNotifications } from '../../hooks/usePushNotifications'
import BellAlertIcon from '../elements/icons/BellAlertIcon'
import MobileFooter from '../elements/MobileFooter'

const AppLayout = ({children, pageTitle}) => {
    // const [sidebarState, setSidebarState] = useState(defaultSidebarState() || 'closed');
    // const toggleSidebar = () => {
    //     if(sidebarState === 'closed') {
    //         localStorage.setItem("defaultSidebarState", "open");
    //         setSidebarState("open")
    //     } else {
    //         localStorage.setItem("defaultSidebarState", "closed");
    //         setSidebarState("closed")
    //     }
    // }
    const business = businessDetails()
    // console.log(business)
    const { enablePushNotifications, isLoading, isSubscribed, isBlocked } = usePushNotifications();
    
    return (
        <Fragment>
            <div className="flex flex-row bg-white">
                <div className={`flex flex-col clear-left min-h-screen z-10 w-full`}>
                    <div className={`fixed z-20 w-full`}>
                        <AdminHeader 
                            pageTitle={pageTitle} 
                            businessDetails={business}
                        />
                    </div>

                    {!isSubscribed && !isBlocked && <div className='mt-20 rounded-lg -mb-15 p-3 bg-yellow-50 border border-yellow-800/20 mx-auto w-11/12 lg:w-9/12 shadow-xl shadow-yellow-800/5 lg:flex items-start'>
                        <div className='w-10 mr-3 hidden xl:block'>
                            <BellAlertIcon className={`w-8 h-8 text-yellow-800/50 animate-pulse rotate-25`} />
                        </div>
                        <div className='w-full lg:w-9/12'>
                            <h3 className='font-semibold text-[15px] leading-[1.1em] text-yellow-800'>Never miss an Order</h3>
                            <p className='text-[13px] text-ss-black'>Enable push notifications to make sure you're alerted for new orders and important updates</p>
                        </div>

                        <div className='flex flex-row-reverse w-full lg:w-3/12'>
                            <button onClick={()=>enablePushNotifications()} disabled={isLoading} className='block disabled:cursor-not-allowed cursor-pointer rounded-lg text-xs text-white font-semibold font-family-bricolage-grotesque bg-yellow-800 px-4 py-3'>
                                Enable Push Notifications
                            </button>
                        </div>

                    </div>}
                    
                    <div className={`mt-10 min-h-[50vh] h-inherit py-10 w-full px-8 lg:px-12 xl:px-32 2xl:px-44 relative pb-20`}>
                        <PendingOrdersFloater />
                        <main>{children}</main>
                    </div>

                    <div className='h-20 pt-2.5 px-5 xl:hidden fixed bottom-0 border-t w-full border-gray-100 z-40 bg-white shadow-[0_-4px_50px_5px_rgba(34,197,94,0.1)]'>
                        <MobileFooter />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default AppLayout
