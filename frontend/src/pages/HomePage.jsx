import { useState, useEffect, useContext } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import api from '../api'

const HomePage = () => {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [searchParams] = useSearchParams()

    // Filters state
    const [category, setCategory] = useState('')
    const [priceMin, setPriceMin] = useState('')
    const [priceMax, setPriceMax] = useState('')
    const [location, setLocation] = useState('')

    const { user } = useContext(AuthContext)

    // Get search term from URL
    const searchTerm = searchParams.get('search') || ''

    useEffect(() => {
        api.get('/categories/')
            .then(res => setCategories(res.data.results || res.data))
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        getProducts()
    }, [searchTerm, category, priceMin, priceMax, location])

    const getProducts = async () => {
        try {
            const params = {}
            if (searchTerm) params.search = searchTerm
            if (category) params.category = category
            if (priceMin) params.price_min = priceMin
            if (priceMax) params.price_max = priceMax
            if (location) params.location = location

            const response = await api.get('/products/', { params })
            setProducts(response.data.results || response.data)
        } catch (error) {
            console.error("Error fetching products", error)
        }
    }

    const handleApplyFilters = () => {
        getProducts()
    }

    return (
        <div className="main-container">
            {/* Welcome Banner */}
            {user && (
                <div style={{
                    background: 'linear-gradient(135deg, #3483FA 0%, #2968C8 100%)',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '6px',
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h3 style={{ margin: 0, fontWeight: 500 }}>¡Hola, {user.username}! 👋</h3>
                        <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: '14px' }}>
                            Descubre los mejores productos agrícolas
                        </p>
                    </div>
                    {user.is_seller && (
                        <Link to="/seller/dashboard" style={{
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: 500
                        }}>
                            Ver mi Dashboard
                        </Link>
                    )}
                </div>
            )}

            <div className="page-layout">
                {/* Sidebar with Filters */}
                <Sidebar
                    categories={categories}
                    selectedCategory={category}
                    onCategoryChange={setCategory}
                    priceMin={priceMin}
                    priceMax={priceMax}
                    onPriceMinChange={setPriceMin}
                    onPriceMaxChange={setPriceMax}
                    location={location}
                    onLocationChange={setLocation}
                    onApplyFilters={handleApplyFilters}
                />

                {/* Main Content */}
                <div className="content-area">
                    {/* Results Header */}
                    <div className="results-header">
                        <div className="results-count">
                            {searchTerm ? (
                                <span>Resultados para "<strong>{searchTerm}</strong>" ({products.length})</span>
                            ) : (
                                <span><strong>{products.length}</strong> productos disponibles</span>
                            )}
                        </div>
                        <div className="sort-options">
                            <span>Ordenar por:</span>
                            <a href="#" className="active">Más relevantes</a>
                            <a href="#">Menor precio</a>
                            <a href="#">Mayor precio</a>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="products-grid">
                        {products.length > 0 ? (
                            products.map(product => (
                                <div key={product.id} className="product-card">
                                    <Link to={`/products/${product.id}`}>
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="product-card-image"
                                            />
                                        ) : (
                                            <div className="product-card-image" style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: '#f5f5f5',
                                                color: '#999'
                                            }}>
                                                🌾 Sin imagen
                                            </div>
                                        )}
                                        <div className="product-card-body">
                                            <p className="price">${Number(product.price).toLocaleString()}</p>
                                            <p className="title">{product.name}</p>
                                            <p className="shipping-badge">
                                                🚚 Envío gratis
                                            </p>
                                            <p className="seller">
                                                Por {product.seller_username}
                                            </p>
                                            {product.location && (
                                                <p className="location">
                                                    📍 {product.location}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                padding: '60px 20px',
                                background: 'white',
                                borderRadius: '6px'
                            }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                                <h3 style={{ color: '#333', marginBottom: '8px' }}>
                                    No encontramos productos
                                </h3>
                                <p style={{ color: '#666' }}>
                                    Intenta con otros términos de búsqueda o filtros
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
