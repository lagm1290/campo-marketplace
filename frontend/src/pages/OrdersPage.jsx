import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const OrdersPage = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/orders/')
            .then(res => {
                setOrders(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    const statusConfig = {
        'PENDING': { label: 'Pendiente', color: '#FF7733', bg: '#FFF3E0' },
        'PAID': { label: 'Pagado', color: '#3483FA', bg: '#E8F2FF' },
        'SHIPPED': { label: 'Enviado', color: '#00A650', bg: '#E6F7ED' },
        'DELIVERED': { label: 'Entregado', color: '#00A650', bg: '#E6F7ED' },
        'CANCELLED': { label: 'Cancelado', color: '#F23D4F', bg: '#FFEBEE' }
    }

    if (loading) {
        return (
            <div className="main-container">
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    Cargando pedidos...
                </div>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="main-container">
                <div style={{
                    background: 'white',
                    borderRadius: '6px',
                    padding: '60px',
                    textAlign: 'center',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
                    <h2 style={{ marginBottom: '8px' }}>No tenés compras</h2>
                    <p style={{ color: '#666', marginBottom: '24px' }}>
                        ¡Explorá el marketplace y realizá tu primera compra!
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
            {/* Header */}
            <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: '6px',
                marginBottom: '16px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
            }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
                    Mis compras
                </h1>
                <p style={{ margin: '8px 0 0', color: '#666' }}>
                    {orders.length} pedido{orders.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Orders List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map(order => {
                    const status = statusConfig[order.status] || statusConfig['PENDING']
                    return (
                        <div
                            key={order.id}
                            style={{
                                background: 'white',
                                borderRadius: '6px',
                                padding: '20px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                            }}
                        >
                            {/* Order Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingBottom: '16px',
                                borderBottom: '1px solid #eee',
                                marginBottom: '16px'
                            }}>
                                <div>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        background: status.bg,
                                        color: status.color,
                                        fontSize: '13px',
                                        fontWeight: 600
                                    }}>
                                        {status.label}
                                    </span>
                                    <span style={{ marginLeft: '12px', color: '#666', fontSize: '14px' }}>
                                        {new Date(order.created_at).toLocaleDateString('es-AR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div style={{ fontWeight: 600, fontSize: '18px' }}>
                                    ${Number(order.total_price).toLocaleString()}
                                </div>
                            </div>

                            {/* Order Items */}
                            {order.items.map(item => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        marginBottom: '12px'
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
                                        🌾
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: 500 }}>
                                            {item.product_name}
                                        </p>
                                        <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>
                                            {item.quantity} unidad{item.quantity !== 1 ? 'es' : ''}
                                        </p>
                                    </div>
                                    <div style={{ fontWeight: 500 }}>
                                        ${Number(item.total_price).toLocaleString()}
                                    </div>
                                </div>
                            ))}

                            {/* Order Footer */}
                            <div style={{
                                marginTop: '16px',
                                paddingTop: '16px',
                                borderTop: '1px solid #eee',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ color: '#666', fontSize: '14px' }}>
                                    Pedido #{order.id}
                                </span>
                                <button style={{
                                    background: 'transparent',
                                    color: '#3483FA',
                                    border: 'none',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    padding: 0
                                }}>
                                    Ver detalle
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default OrdersPage
