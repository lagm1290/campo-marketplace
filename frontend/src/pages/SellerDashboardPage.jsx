import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import AuthContext from '../context/AuthContext'

const SellerDashboardPage = () => {
    const { user } = useContext(AuthContext)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        pendingOrders: 0
    })

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = () => {
        api.get('/orders/seller/')
            .then(res => {
                setOrders(res.data)
                // Calculate stats
                const totalSales = res.data.reduce((sum, o) => sum + Number(o.total_price), 0)
                const pendingOrders = res.data.filter(o => o.status === 'PENDING' || o.status === 'PAID').length
                setStats({
                    totalSales,
                    totalOrders: res.data.length,
                    pendingOrders
                })
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.post(`/orders/seller/${orderId}/update_status/`, { status: newStatus })
            fetchOrders()
        } catch (err) {
            console.error(err)
            alert('Error al actualizar el estado')
        }
    }

    const statusConfig = {
        'PENDING': { label: 'Pendiente', color: '#FF7733', bg: '#FFF3E0' },
        'PAID': { label: 'Pagado', color: '#3483FA', bg: '#E8F2FF' },
        'SHIPPED': { label: 'Enviado', color: '#00A650', bg: '#E6F7ED' },
        'DELIVERED': { label: 'Entregado', color: '#00A650', bg: '#E6F7ED' },
        'CANCELLED': { label: 'Cancelado', color: '#F23D4F', bg: '#FFEBEE' }
    }

    if (!user?.is_seller) {
        return (
            <div className="main-container">
                <div style={{
                    background: 'white',
                    borderRadius: '6px',
                    padding: '60px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
                    <h2>Acceso restringido</h2>
                    <p style={{ color: '#666', marginBottom: '24px' }}>
                        Solo los vendedores pueden acceder a esta página.
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
                        Ir al inicio
                    </Link>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="main-container">
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    Cargando dashboard...
                </div>
            </div>
        )
    }

    return (
        <div className="main-container">
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #3483FA 0%, #2968C8 100%)',
                color: 'white',
                padding: '24px',
                borderRadius: '6px',
                marginBottom: '16px'
            }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: 'white' }}>
                    Dashboard de Vendedor
                </h1>
                <p style={{ margin: '8px 0 0', opacity: 0.9 }}>
                    Gestioná tus ventas y pedidos
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '6px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                }}>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Ventas totales</p>
                    <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 600, color: '#00A650' }}>
                        ${stats.totalSales.toLocaleString()}
                    </p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '6px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                }}>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total de pedidos</p>
                    <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 600, color: '#333' }}>
                        {stats.totalOrders}
                    </p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '6px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                }}>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Pedidos por gestionar</p>
                    <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 600, color: '#FF7733' }}>
                        {stats.pendingOrders}
                    </p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '6px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                }}>
                    <Link
                        to="/products/new"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            color: '#3483FA',
                            textDecoration: 'none',
                            fontWeight: 600,
                            height: '100%'
                        }}
                    >
                        ➕ Publicar producto
                    </Link>
                </div>
            </div>

            {/* Orders List */}
            <div style={{
                background: 'white',
                borderRadius: '6px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                        Pedidos recientes
                    </h2>
                </div>

                {orders.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                        <h3 style={{ marginBottom: '8px' }}>No tenés pedidos todavía</h3>
                        <p style={{ color: '#666' }}>
                            Cuando los clientes compren tus productos, los pedidos aparecerán acá.
                        </p>
                    </div>
                ) : (
                    <div>
                        {orders.map(order => {
                            const status = statusConfig[order.status] || statusConfig['PENDING']
                            return (
                                <div
                                    key={order.id}
                                    style={{
                                        padding: '20px',
                                        borderBottom: '1px solid #eee'
                                    }}
                                >
                                    {/* Order Header */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
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
                                            <p style={{ margin: '8px 0 0', fontWeight: 600 }}>
                                                Pedido #{order.id}
                                            </p>
                                            <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>
                                                {new Date(order.created_at).toLocaleDateString('es-AR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: 0, fontWeight: 600, fontSize: '20px' }}>
                                                ${Number(order.total_price).toLocaleString()}
                                            </p>
                                            <p style={{ margin: '4px 0 0', color: '#666', fontSize: '13px' }}>
                                                Comisión: ${Number(order.commission || 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Buyer Info */}
                                    <div style={{
                                        background: '#f5f5f5',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        marginBottom: '16px',
                                        fontSize: '14px'
                                    }}>
                                        <p style={{ margin: 0 }}>
                                            <strong>Comprador:</strong> {order.buyer}
                                        </p>
                                        <p style={{ margin: '4px 0 0' }}>
                                            <strong>Envío:</strong> {order.shipping_method === 'PICKUP' ? '🏡 Retiro en local' : '🚚 Envío a domicilio'}
                                        </p>
                                    </div>

                                    {/* Items */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <p style={{ margin: '0 0 8px', fontWeight: 500, fontSize: '14px' }}>
                                            Productos:
                                        </p>
                                        {order.items.map(item => (
                                            <div
                                                key={item.id}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    padding: '8px 0',
                                                    borderBottom: '1px solid #eee',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <span>{item.product_name} × {item.quantity}</span>
                                                <span style={{ fontWeight: 500 }}>
                                                    ${Number(item.total_price).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {order.status === 'PENDING' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'PAID')}
                                                style={{
                                                    background: '#3483FA',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '10px 20px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: 500
                                                }}
                                            >
                                                Marcar como pagado
                                            </button>
                                        )}
                                        {order.status === 'PAID' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                                                style={{
                                                    background: '#00A650',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '10px 20px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: 500
                                                }}
                                            >
                                                Marcar como enviado
                                            </button>
                                        )}
                                        {order.status === 'SHIPPED' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                                                style={{
                                                    background: '#00A650',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '10px 20px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: 500
                                                }}
                                            >
                                                Marcar como entregado
                                            </button>
                                        )}
                                        {(order.status === 'PENDING' || order.status === 'PAID') && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                                style={{
                                                    background: 'transparent',
                                                    color: '#F23D4F',
                                                    border: '1px solid #F23D4F',
                                                    padding: '10px 20px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: 500
                                                }}
                                            >
                                                Cancelar pedido
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SellerDashboardPage
