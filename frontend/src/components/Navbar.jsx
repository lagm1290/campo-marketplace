import { Link, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import CartContext from '../context/CartContext'

const Navbar = () => {
    const { user, logoutUser } = useContext(AuthContext)
    const { cartCount } = useContext(CartContext)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/?search=${encodeURIComponent(searchTerm)}`)
    }

    return (
        <>
            {/* Top Promotional Bar */}
            <div className="top-bar">
                🚚 ¡Envío gratis en productos agrícolas seleccionados!
                <a href="#">Ver más</a>
            </div>

            {/* Main Header */}
            <header className="header">
                <div className="header-container">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <span className="logo-icon">🌾</span>
                        Campo
                    </Link>

                    {/* Search Bar */}
                    <div className="search-container">
                        <form className="search-bar" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Buscar productos agrícolas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit">
                                <span className="search-icon">🔍</span>
                            </button>
                        </form>
                    </div>

                    {/* Header Actions */}
                    <div className="header-actions">
                        {user ? (
                            <>
                                <Link to="/orders" className="header-link">
                                    <span className="header-link-icon">📦</span>
                                    <span>Mis Compras</span>
                                </Link>
                                <span className="header-link" onClick={logoutUser} style={{ cursor: 'pointer' }}>
                                    <span className="header-link-icon">👤</span>
                                    <span>{user.username}</span>
                                </span>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="header-link">
                                    <span>Crear cuenta</span>
                                </Link>
                                <Link to="/login" className="header-link">
                                    <span>Ingresar</span>
                                </Link>
                            </>
                        )}
                        <Link to="/cart" className="header-link cart-badge">
                            <span className="header-link-icon">🛒</span>
                            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Secondary Navigation */}
            <nav className="secondary-nav">
                <div className="secondary-nav-container">
                    <Link to="/">Categorías ▾</Link>
                    <Link to="/">Ofertas</Link>
                    {user && user.is_seller && (
                        <>
                            <Link to="/products/new" className="highlight">Vender</Link>
                            <Link to="/seller/dashboard">Mi Dashboard</Link>
                        </>
                    )}
                    <Link to="/">Historial</Link>
                    <Link to="/">Ayuda</Link>
                </div>
            </nav>
        </>
    )
}

export default Navbar
