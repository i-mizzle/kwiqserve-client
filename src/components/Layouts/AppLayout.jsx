import React, { Fragment, useState } from 'react'
import AdminHeader from '../partials/AdminHeader'
import CollapsedSidebar from '../partials/CollapsedSidebar'
import Sidebar from '../partials/Sidebar'
import { defaultSidebarState } from '../../utils'

const AppLayout = ({children, pageTitle}) => {
    const [sidebarState, setSidebarState] = useState(defaultSidebarState() || 'closed');
    const toggleSidebar = () => {
        if(sidebarState === 'closed') {
            localStorage.setItem("defaultSidebarState", "open");
            setSidebarState("open")
        } else {
            localStorage.setItem("defaultSidebarState", "closed");
            setSidebarState("closed")
        }
    }

    return (
        <Fragment>
            <div className="flex flex-row bg-white p-[5px]">
                <div style={{zIndex: 990}} className={`min-h-screen ${sidebarState === "open" ? 'w-1/6' : 'w-24'}`}>
                    {sidebarState === "open" ? <div className="h-screen w-1/6 fixed">
                        <Sidebar toggleFunction={toggleSidebar} />
                    </div>
                    :
                    <div className="h-screen bg-grey w-[80px] fixed">
                        <CollapsedSidebar toggleFunction={toggleSidebar}   />
                    </div>}

                    <div className={`z-0 ${sidebarState === 'open' ? "w-1/6" : "w-[80px]"}`} />
                </div>
                <div className={`flex flex-col clear-left min-h-screen z-10 ${sidebarState === 'open' ? 'w-5/6' : 'w-full'}`}>
                    <div className={`fixed z-20 ${sidebarState === 'open' ? "w-5/6" : "w-full pr-20"}`}>
                        <AdminHeader 
                            pageTitle={pageTitle} 
                            sidebarActive={sidebarState === 'open'}  
                            sidebarToggleFunction={toggleSidebar} 
                        />
                    </div>
                    
                    <div className={`mt-[50px] min-h-screen py-10 ${sidebarState === 'open' ? 'px-4 2xl:px-10' : 'lg:px-8 2xl:px-12'}`}>
                        <main>{children}</main>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default AppLayout
