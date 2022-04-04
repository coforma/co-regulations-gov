import { createContext } from 'react';
import { connect, Socket } from 'socket.io-client';

export const socket: Socket = connect(
  `http://localhost:${process.env.REACT_APP_SERVER_PORT}`
);

export const SocketContext = createContext({} as Socket);
