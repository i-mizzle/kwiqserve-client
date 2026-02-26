import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { baseUrl, businessDetails } from '../utils.js';
import { setNotification } from '../store/actions/notificationActions.js';
import { SET_NOTIFICATION, SET_SUCCESS } from '../store/types.js';
import { fetchOrders } from '../store/actions/ordersActions.js';
// import NewOrderSound from '../assets/sound/new-order.wav'

// Notification sound utility
const playNotificationSound = () => {
  try {
    // Create audio context for better browser compatibility
    const audio = new Audio('/new-order.wav');
    audio.volume = 0.7; // 70% volume
    audio.play().catch(error => {
      console.warn('Could not play notification sound:', error);
    });
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

export const useSocket = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const business = businessDetails();
      const user = JSON.parse(localStorage.getItem('user'));
      
      console.log('🔧 Socket setup - Business:', business?._id, 'User auth:', !!user?.authToken);
      
      // Only connect if we have a business ID and auth token
      if (!business || !business._id) {
        console.warn('⚠️ No business details found, socket connection skipped');
        return;
      }

      if (!user || !user.authToken) {
        console.warn('⚠️ No authentication token found, socket connection skipped');
        return;
      }

      console.log('🚀 Initializing socket connection to:', baseUrl);

      // Initialize socket connection
      if (!socketRef.current) {
        socketRef.current = io(baseUrl, {
          path: '/ws',
          auth: {
            token: user.authToken,
          },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        console.log('💡 Socket instance created with path: /ws');

        // Handle connection
        socketRef.current.on('connect', () => {
          console.log('✅ Socket connected:', socketRef.current.id);
          
          // Expose socket to window for debugging AFTER connection
          window.__socket = socketRef.current;
          console.log('🔍 Socket exposed to window.__socket for debugging');
          
          // Join the business room
          const roomName = `business:${business._id}`;
          socketRef.current.emit('join_room', {businessId: business._id}, (response) => {
            console.log('room name:----> ', roomName)
            console.log('📥 Server acknowledged join_room:', response);
          });
          console.log('📡 Attempting to join room:', roomName);
          
          // Test if we can receive events by emitting a ping
          setTimeout(() => {
            console.log('🏓 Testing connection - emitting ping');
            socketRef.current.emit('ping', { test: true }, (pong) => {
              console.log('🏓 Pong received:', pong);
            });
          }, 1000);
        });

        // Confirmation of room join
        socketRef.current.on('room_joined', (data) => {
          console.log('✅ Successfully joined room:', data);
        });

        // Catch-all listener to see ALL events being received
        socketRef.current.onAny((eventName, ...args) => {
          console.log('🔔 Socket event received:', eventName, args);
        });

        // Listen for new orders
        socketRef.current.on('order:new', (data) => {
          console.log('🆕 New order received:', data);
          dispatch(fetchOrders())
          // Play notification sound
          playNotificationSound();
          
          const message = data.orderRef 
            ? `New order #${data.orderRef} received` 
            : 'A new order has been received';
          console.log('Dispatching notification:', message);
          dispatch(setNotification(message));
          // dispatch({
          //   type: SET_NOTIFICATION,
          //   payload: message
          // })
        });

        // Listen for delivered orders
        socketRef.current.on('order:delivered', (data) => {
          console.log('✅ Order delivered:', data);
          const message = data.orderRef 
            ? `Order #${data.orderRef} has been delivered` 
            : 'An order has been delivered';
          console.log('Dispatching notification:', message);
          dispatch(setNotification(message));
        });

        // Handle connection errors
        socketRef.current.on('connect_error', (error) => {
          console.error('❌ Socket connection error:', error);
        });

        // Handle disconnection
        socketRef.current.on('disconnect', (reason) => {
          console.log('🔌 Socket disconnected. Reason:', reason);
        });

        // Handle reconnection attempts
        socketRef.current.on('reconnect_attempt', (attemptNumber) => {
          console.log('🔄 Reconnection attempt:', attemptNumber);
        });

        socketRef.current.on('reconnect', (attemptNumber) => {
          console.log('✅ Reconnected after', attemptNumber, 'attempts');
        });
      }
    } catch (error) {
      console.error('Error setting up socket connection:', error);
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [dispatch]);
};
