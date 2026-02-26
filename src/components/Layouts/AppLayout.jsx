import React, { Fragment } from 'react'
import AdminHeader from '../partials/AdminHeader'
import { businessDetails } from '../../utils'
import PendingOrdersFloater from '../elements/PendingOrdersFloater'

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
                    
                    <div className={`mt-10 min-h-[50vh] h-inherit py-10 w-full px-8 lg:px-12 xl:px-32 relative`}>
                        <PendingOrdersFloater />
                        <main>{children}</main>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default AppLayout
