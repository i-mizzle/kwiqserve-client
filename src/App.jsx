import { Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'
import './App.css'
import Login from './pages/auth/Login.jsx'
import ErrorNotifier from './components/elements/ErrorNotifier.jsx'
import SuccessNotifier from './components/elements/SuccessNotifier.jsx'
import ScrollToTop from './components/Layouts/ScrollToTop.jsx'
import Signup from './pages/onboarding/Signup.jsx'

function App() {
  return (
    <Provider store={store}>
      <ErrorNotifier />
      <SuccessNotifier />
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </ScrollToTop>
    </Provider>
  )
}

export default App
