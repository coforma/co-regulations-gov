import { createContext } from 'react';
import socketio from "socket.io-client";

// TODO: handle URL
export const socket = socketio.connect('http://localhost:3000');
export const SocketContext = createContext();