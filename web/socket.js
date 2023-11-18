import { io } from "socket.io-client";
import { createContext } from "react";
export const socket = io(import.meta.env.VITE_REACT_API_URL, { transports: ['websocket'] });
export const SocketContext = createContext();