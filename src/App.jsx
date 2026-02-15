import { Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'
import './App.css'
import Login from './pages/auth/Login.jsx'
import ErrorNotifier from './components/elements/ErrorNotifier.jsx'
import SuccessNotifier from './components/elements/SuccessNotifier.jsx'
import ScrollToTop from './components/Layouts/ScrollToTop.jsx'
import Signup from './pages/onboarding/Signup.jsx'
import ConfirmEmail from './pages/onboarding/ConfirmEmail.jsx'
import Dashboard from './pages/business/Dashboard.jsx'
import Business from './pages/Business.jsx'
import SetPassword from './pages/business/SetPassword.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import BusinessErrorPage from './pages/business/BusinessErrorPage.jsx'
import Items from './pages/business/items/Items.jsx'
import ItemDetails from './pages/business/items/ItemDetails.jsx'
import NewItem from './pages/business/items/NewItem.jsx'
import Menus from './pages/business/menus/Menus.jsx'
import MenuDetails from './pages/business/menus/MenuDetails.jsx'
import NewMenu from './pages/business/menus/NewMenu.jsx'
import Orders from './pages/business/orders/Orders.jsx'
import OrderDetails from './pages/business/orders/OrderDetails.jsx'
import Payments from './pages/business/payments/Payments.jsx'
import Tables from './pages/business/tables/Tables.jsx'
import TableDetails from './pages/business/tables/TableDetails.jsx'
import PublicTable from './pages/public/PublicTable.jsx'
import Cart from './pages/public/Cart.jsx'

function App() {
  return (
    <Provider store={store}>
      <ErrorNotifier />
      <SuccessNotifier />
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirm-email/:confirmationCode" element={<ConfirmEmail />} />
          <Route path="/tables/:tableId" element={<PublicTable />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/business" element={<Business />}>
            <Route path="/business/" element={<Navigate replace to="/business/dashboard" />} />
            {/* <Route path="/business/dashboard/getting-started" element={<GettingStarted />} /> */}
            <Route path="/business/dashboard" element={<Dashboard />} />
            <Route path="/business/change-password" element={<SetPassword />} />

            <Route path="/business/tables" element={<Tables />} />
            <Route path="/business/tables/table/:tableId" element={<TableDetails />} />
            
            <Route path="/business/items" element={<Items />} />
            <Route path="/business/items/item/:itemId" element={<ItemDetails />} />
            <Route path="/business/items/new-item" element={<NewItem />} />

            <Route path="/business/menus" element={<Menus />} />
            <Route path="/business/menus/menu/:menuId" element={<MenuDetails />} />
            <Route path="/business/menus/new-menu" element={<NewMenu />} />

            <Route path="/business/orders" element={<Orders />} />
            <Route path="/business/menus/menu/:menuId" element={<OrderDetails />} />

            <Route path="/business/payments" element={<Payments />} />

            {/* Catch-all for business routes */}
            <Route path="/business/*" element={<BusinessErrorPage />} />
          </Route>
          
          {/* Catch-all for non-business routes */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </ScrollToTop>
    </Provider>
  )
}

export default App
