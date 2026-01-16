import { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'
import CartContext from '../context/CartContext'
import AuthContext from '../context/AuthContext'

const ProductPage = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [reviewText, setReviewText] = useState('')
    const [reviewRating, setReviewRating] = useState(5)
    const [submitting, setSubmitting] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const { user } = useContext(AuthContext)
    const { addToCart } = useContext(CartContext)

    const fetchProduct = () => {
        api.get(`/products/${id}/`)
            .then(res => setProduct(res.data))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        fetchProduct()
    }, [id])

    const handleReviewSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await api.post(`/products/${id}/reviews/`, {
                rating: reviewRating,
                comment: reviewText
            })
            setReviewText('')
            setReviewRating(5)
            fetchProduct()
        } catch (err) {
            console.error(err)
            alert('Error al enviar la reseña')
        } finally {
            setSubmitting(false)
        }
    }

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product)
        }
    }

    if (!product) {
        return (
            <div className="main-container">
                <div className="product-page" style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
                    Cargando producto...
                </div>
            </div>
        )
    }

    const averageRating = product.reviews && product.reviews.length > 0
        ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
        : null

    return (
        <div className="main-container">
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
                <Link to="/">Inicio</Link>
                <span>›</span>
                <span>{product.category_name || 'Productos'}</span>
                <span>›</span>
                <span>{product.name}</span>
            </div>

            <div className="product-page">
                <div className="product-detail-layout">
                    {/* Left Column - Gallery */}
                    <div className="product-gallery">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="product-main-image"
                            />
                        ) : (
                            <div className="product-main-image" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#f5f5f5',
                                color: '#999',
                                height: '400px',
                                fontSize: '48px'
                            }}>
                                🌾
                            </div>
                        )}

                        {/* Product Description below image */}
                        <div className="product-description">
                            <h2>Descripción</h2>
                            <p>{product.description || 'Sin descripción disponible.'}</p>
                        </div>
                    </div>

                    {/* Right Column - Buy Box */}
                    <div className="buy-box">
                        <p className="condition">
                            {product.condition === 'NEW' ? '🆕 Nuevo' : '♻️ Usado'} |
                            {product.stock > 0 ? ` ${product.stock} disponibles` : ' Sin stock'}
                        </p>

                        <h1 className="title">{product.name}</h1>

                        {averageRating && (
                            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#3483FA', fontSize: '18px' }}>
                                    {'★'.repeat(Math.round(Number(averageRating)))}
                                    {'☆'.repeat(5 - Math.round(Number(averageRating)))}
                                </span>
                                <span style={{ color: '#3483FA', fontWeight: 500 }}>{averageRating}</span>
                                <span style={{ color: '#999', fontSize: '14px' }}>
                                    ({product.reviews?.length} opiniones)
                                </span>
                            </div>
                        )}

                        <p className="price">${Number(product.price).toLocaleString()}</p>

                        <p className="installments">
                            Hasta 12 cuotas sin interés
                        </p>

                        <div className="shipping-info">
                            <p><span className="free">Envío gratis</span> a todo el país</p>
                            <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                                📍 {product.location || 'Ubicación no especificada'}
                            </p>
                        </div>

                        <div className="quantity">
                            <span>Cantidad:</span>
                            <select
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            >
                                {[...Array(Math.min(10, product.stock || 10))].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1} unidad{i > 0 ? 'es' : ''}</option>
                                ))}
                            </select>
                            <span style={{ color: '#999', fontSize: '13px' }}>
                                ({product.stock} disponibles)
                            </span>
                        </div>

                        <button
                            className="btn-primary"
                            onClick={handleAddToCart}
                            disabled={!product.stock}
                        >
                            Comprar ahora
                        </button>

                        <button
                            className="btn-secondary"
                            onClick={handleAddToCart}
                            disabled={!product.stock}
                        >
                            Agregar al carrito
                        </button>

                        {/* Seller Info */}
                        <div className="seller-info">
                            <p className="seller-name">
                                Vendido por {product.seller_username}
                            </p>
                            <div className="seller-reputation">
                                <span style={{ color: '#00A650' }}>●</span>
                                <span>Vendedor verificado</span>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                            <p style={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                Medios de pago
                            </p>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <span className="badge badge-primary">💳 Tarjeta</span>
                                <span className="badge badge-success">🏦 Transferencia</span>
                                <span className="badge badge-primary">📱 MercadoPago</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    <h2>Opiniones del producto</h2>

                    {averageRating && (
                        <div className="review-summary">
                            <div className="review-average">
                                <div className="score">{averageRating}</div>
                                <div className="stars">
                                    {'★'.repeat(Math.round(Number(averageRating)))}
                                    {'☆'.repeat(5 - Math.round(Number(averageRating)))}
                                </div>
                                <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                                    {product.reviews?.length} opiniones
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Review Form */}
                    {user && (
                        <form className="review-form" onSubmit={handleReviewSubmit}>
                            <h4>Dejá tu opinión</h4>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ marginRight: '8px' }}>Calificación:</label>
                                <select
                                    value={reviewRating}
                                    onChange={e => setReviewRating(Number(e.target.value))}
                                    style={{ padding: '8px', width: 'auto' }}
                                >
                                    {[5, 4, 3, 2, 1].map(r => (
                                        <option key={r} value={r}>{r} {'★'.repeat(r)}</option>
                                    ))}
                                </select>
                            </div>
                            <textarea
                                value={reviewText}
                                onChange={e => setReviewText(e.target.value)}
                                placeholder="Contá tu experiencia con este producto..."
                                required
                            />
                            <button type="submit" disabled={submitting}>
                                {submitting ? 'Enviando...' : 'Enviar opinión'}
                            </button>
                        </form>
                    )}

                    {/* Review List */}
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map(review => (
                            <div key={review.id} className="review-item">
                                <div className="review-header">
                                    <span className="review-author">{review.buyer_username}</span>
                                    <span className="review-rating">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </span>
                                </div>
                                <p className="review-text">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#666', padding: '20px 0' }}>
                            Este producto aún no tiene opiniones. ¡Sé el primero en opinar!
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductPage
