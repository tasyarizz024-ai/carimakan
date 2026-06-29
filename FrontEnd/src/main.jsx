import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { FavoriteProvider } from './context/FavoriteContext.jsx'
import { MenuProvider } from './context/MenuContext.jsx'
import { OrderProvider } from './context/OrderContext.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MenuProvider>
        <OrderProvider>
          <CartProvider>
            <FavoriteProvider>
              <App />
            </FavoriteProvider>
          </CartProvider>
        </OrderProvider>
      </MenuProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
