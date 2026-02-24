import React from 'react'
import SettingsLayout from '../../components/Layouts/SettingsLayout'
import { Outlet } from 'react-router-dom'

const Settings = () => {
  return (
    <SettingsLayout>
        <Outlet />
    </SettingsLayout>
  )
}

export default Settings