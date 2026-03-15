import { matchPath, useLocation } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket.js';

const SOCKET_EXEMPT_PATHS = [
  '/',
  '/signup',
  '/confirm-email/:confirmationCode',
  '/tables/:tableId',
  '/tables/:tableId/cart',
  '/tables/:tableId/verify-payment',
  '/customer-order/:orderRef',
];

const AppSocketManager = ({ children }) => {
  const location = useLocation();

  const isSocketExemptRoute = SOCKET_EXEMPT_PATHS.some((pattern) =>
    matchPath({ path: pattern, end: true }, location.pathname)
  );

  // Initialize socket connection for non-exempt routes only.
  useSocket({ enabled: !isSocketExemptRoute });

  return children;
};

export default AppSocketManager;
