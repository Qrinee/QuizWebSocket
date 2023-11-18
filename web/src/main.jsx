import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import {LobbyPage} from './pages/LobbyPage.jsx'
import { GamePage } from './pages/GamePage.jsx'
import { socket, SocketContext } from '../socket.js'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/lobby',
    element: <LobbyPage/>
  },
  {
    path: '/game',
    element: <GamePage/>
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(

    <SocketContext.Provider value={socket}>
    <RouterProvider router={router} />
    </SocketContext.Provider>

)
