import { createContext } from 'react';
import socketio from 'socket.io-client';

export const socket = socketio.connect(
  `http://localhost:${process.env.REACT_APP_SERVER_PORT}`
);
export const SocketContext = createContext();
