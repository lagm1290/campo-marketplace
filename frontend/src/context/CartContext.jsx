import { createContext, useState, useEffect } from 'react'

const CartContext = createContext()

export default CartContext

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        return localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
    })

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }, [cartItems])

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id)
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            } else {
                return [...prevItems, { ...product, quantity: 1 }]
            }
        })
    }

    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id))
    }

    const clearCart = () => {
        setCartItems([])
    }

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)

    const contextData = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount
    }

    return (
        <CartContext.Provider value={contextData}>
            {children}
        </CartContext.Provider>
    )
}
