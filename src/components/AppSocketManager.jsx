import { useSocket } from '../hooks/useSocket.js';

const AppSocketManager = ({ children }) => {
  // Initialize socket connection
  useSocket();

  return children;
};

export default AppSocketManager;
