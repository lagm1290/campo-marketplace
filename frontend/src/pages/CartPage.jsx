import { useContext } from 'react'
import { Link } from 'react-router-dom'
import CartContext from '../context/CartContext'

const CartPage = () => {
    const { cartItems, removeFromCart, clearCart, cartTotal } = useContext(CartContext)

    if (cartItems.length === 0) {
        return (
            <div className="main-container">
                <div className="cart-page" style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
                    <h2 style={{ marginBottom: '8px' }}>Tu carrito está vacío</h2>
                    <p style={{ color: '#666', marginBottom: '24px' }}>
                        ¡Descubrí los mejores productos agrícolas!
                    </p>
                    <Link
                        to="/"
                        style={{
                            display: 'inline-block',
                            background: '#3483FA',
                            color: 'white',
                            padding: '14px 32px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: 600
                        }}
                    >
                        Ver productos
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="main-container">
            <div className="cart-page">
                <h1>Carrito de compras</h1>

                <div style={{ marginTop: '24px' }}>
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            {item.image ? (
                                <img src={item.image} alt={item.name} />
                            ) : (
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    background: '#f5f5f5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '6px'
                                }}>
                                    🌾
                                </div>
                            )}
                            <div className="cart-item-info">
                                <Link
                                    to={`/products/${item.id}`}
                                    className="cart-item-name"
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    {item.name}
                                </Link>
                                <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>
                                    Cantidad: {item.quantity}
                                </p>
                                <button
                                    className="cart-item-remove"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                            <div className="cart-item-price">
                                ${(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <div>
                        <span style={{ color: '#666' }}>Total:</span>
                        <span className="cart-total" style={{ marginLeft: '12px' }}>
                            ${cartTotal.toLocaleString()}
                        </span>
                    </div>
                    <Link
                        to="/checkout"
                        className="cart-checkout-btn"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        Continuar compra
                    </Link>
                </div>

                <div style={{ marginTop: '16px', textAlign: 'right' }}>
                    <button
                        onClick={clearCart}
                        style={{
                            background: 'transparent',
                            color: '#3483FA',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            padding: 0
                        }}
                    >
                        Vaciar carrito
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CartPage
