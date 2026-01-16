import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import CartContext from '../context/CartContext'
import api from '../api'

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useContext(CartContext)
    const [status, setStatus] = useState('idle')
    const [shippingMethod, setShippingMethod] = useState('PICKUP')

    const handlePayment = async () => {
        setStatus('creating_order')
        try {
            const itemsPayload = cartItems.map(item => ({
                id: item.id,
                quantity: item.quantity
            }))

            const orderRes = await api.post('/orders/', {
                items: itemsPayload,
                shipping_method: shippingMethod
            })
            const orderId = orderRes.data.id

            setStatus('paying')
            const paymentRes = await api.post('/payments/pay/', { order_id: orderId })

            if (paymentRes.data.success) {
                setStatus('success')
                clearCart()
                setTimeout(() => {
                    window.location.href = '/orders'
                }, 2000)
            } else {
                setStatus('error')
            }

        } catch (error) {
            console.error(error)
            setStatus('error')
        }
    }

    if (status === 'success') {
        return (
            <div className="main-container">
                <div style={{
                    background: 'white',
                    borderRadius: '6px',
                    padding: '60px',
                    textAlign: 'center',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#E6F7ED',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        fontSize: '40px'
                    }}>
                        ✓
                    </div>
                    <h2 style={{ color: '#00A650', marginBottom: '8px' }}>¡Pago exitoso!</h2>
                    <p style={{ color: '#666' }}>Redirigiendo a tus compras...</p>
                </div>
            </div>
        )
    }

    if (cartItems.length === 0) {
        return (
            <div className="main-container">
                <div style={{
                    background: 'white',
                    borderRadius: '6px',
                    padding: '60px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
                    <h2 style={{ marginBottom: '8px' }}>Tu carrito está vacío</h2>
                    <p style={{ color: '#666', marginBottom: '24px' }}>
                        Agregá productos para continuar con la compra
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

    const commission = (parseFloat(cartTotal) * 0.10).toFixed(2)

    return (
        <div className="main-container">
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 360px',
                gap: '24px',
                maxWidth: '900px',
                margin: '0 auto'
            }}>
                {/* Left Column - Summary */}
                <div>
                    <div style={{
                        background: 'white',
                        borderRadius: '6px',
                        padding: '24px',
                        marginBottom: '16px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                    }}>
                        <h2 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: 600 }}>
                            Resumen de compra
                        </h2>

                        {cartItems.map(item => (
                            <div
                                key={item.id}
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    padding: '16px 0',
                                    borderBottom: '1px solid #eee'
                                }}
                            >
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    background: '#f5f5f5',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                borderRadius: '6px'
                                            }}
                                        />
                                    ) : '🌾'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontWeight: 500 }}>{item.name}</p>
                                    <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>
                                        Cantidad: {item.quantity}
                                    </p>
                                </div>
                                <div style={{ fontWeight: 500 }}>
                                    ${(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Shipping Method */}
                    <div style={{
                        background: 'white',
                        borderRadius: '6px',
                        padding: '24px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                    }}>
                        <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 600 }}>
                            Método de entrega
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '16px',
                                border: shippingMethod === 'PICKUP' ? '2px solid #3483FA' : '1px solid #ddd',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                background: shippingMethod === 'PICKUP' ? '#E8F2FF' : 'white'
                            }}>
                                <input
                                    type="radio"
                                    name="shipping"
                                    value="PICKUP"
                                    checked={shippingMethod === 'PICKUP'}
                                    onChange={e => setShippingMethod(e.target.value)}
                                    style={{ width: 'auto', margin: 0 }}
                                />
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontWeight: 500 }}>🏡 Retiro en local</span>
                                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
                                        Coordiná el retiro con el vendedor
                                    </p>
                                </div>
                                <span style={{ color: '#00A650', fontWeight: 600 }}>Gratis</span>
                            </label>

                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '16px',
                                border: shippingMethod === 'SHIPPING' ? '2px solid #3483FA' : '1px solid #ddd',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                background: shippingMethod === 'SHIPPING' ? '#E8F2FF' : 'white'
                            }}>
                                <input
                                    type="radio"
                                    name="shipping"
                                    value="SHIPPING"
                                    checked={shippingMethod === 'SHIPPING'}
                                    onChange={e => setShippingMethod(e.target.value)}
                                    style={{ width: 'auto', margin: 0 }}
                                />
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontWeight: 500 }}>🚚 Envío a domicilio</span>
                                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
                                        Recibí el producto en tu dirección
                                    </p>
                                </div>
                                <span style={{ color: '#00A650', fontWeight: 600 }}>Gratis</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column - Payment */}
                <div>
                    <div style={{
                        background: 'white',
                        borderRadius: '6px',
                        padding: '24px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                        position: 'sticky',
                        top: '120px'
                    }}>
                        <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 600 }}>
                            Detalle de pago
                        </h3>

                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#666' }}>Productos ({cartItems.length})</span>
                                <span>${Number(cartTotal).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#666' }}>Envío</span>
                                <span style={{ color: '#00A650' }}>Gratis</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingTop: '12px',
                                borderTop: '1px solid #eee',
                                fontWeight: 600,
                                fontSize: '18px'
                            }}>
                                <span>Total</span>
                                <span>${Number(cartTotal).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div style={{
                            background: '#f5f5f5',
                            padding: '12px',
                            borderRadius: '6px',
                            marginBottom: '16px',
                            fontSize: '13px'
                        }}>
                            <p style={{ margin: 0, fontWeight: 500, marginBottom: '4px' }}>
                                💳 Tarjeta de prueba
                            </p>
                            <p style={{ margin: 0, color: '#666', fontFamily: 'monospace' }}>
                                4242 4242 4242 4242
                            </p>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={status !== 'idle'}
                            style={{
                                width: '100%',
                                padding: '16px',
                                fontSize: '16px',
                                fontWeight: 600,
                                background: status === 'error' ? '#F23D4F' : '#3483FA',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                cursor: status !== 'idle' ? 'not-allowed' : 'pointer',
                                opacity: status !== 'idle' && status !== 'error' ? 0.7 : 1
                            }}
                        >
                            {status === 'idle' && `Pagar $${Number(cartTotal).toLocaleString()}`}
                            {status === 'creating_order' && 'Creando pedido...'}
                            {status === 'paying' && 'Procesando pago...'}
                            {status === 'error' && 'Error. Intentar de nuevo'}
                        </button>

                        <p style={{
                            marginTop: '12px',
                            textAlign: 'center',
                            color: '#666',
                            fontSize: '12px'
                        }}>
                            🔒 Tu pago está protegido
                        </p>

                        {/* Commission info */}
                        <div style={{
                            marginTop: '16px',
                            paddingTop: '16px',
                            borderTop: '1px solid #eee',
                            fontSize: '12px',
                            color: '#999'
                        }}>
                            <p style={{ margin: 0 }}>
                                Comisión de plataforma (10%): ${commission}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage
