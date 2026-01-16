const Sidebar = ({
    categories = [],
    selectedCategory,
    onCategoryChange,
    priceMin,
    priceMax,
    onPriceMinChange,
    onPriceMaxChange,
    location,
    onLocationChange,
    onApplyFilters
}) => {
    return (
        <aside className="sidebar">
            {/* Categories */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">Categorías</h3>
                <ul className="sidebar-list">
                    <li>
                        <button
                            className={!selectedCategory ? 'active' : ''}
                            onClick={() => onCategoryChange('')}
                        >
                            Todas las categorías
                        </button>
                    </li>
                    {categories.map(cat => (
                        <li key={cat.id}>
                            <button
                                className={selectedCategory === cat.id.toString() ? 'active' : ''}
                                onClick={() => onCategoryChange(cat.id.toString())}
                            >
                                {cat.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Filter */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">Precio</h3>
                <div className="price-filter">
                    <input
                        type="number"
                        placeholder="Mínimo"
                        value={priceMin}
                        onChange={(e) => onPriceMinChange(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Máximo"
                        value={priceMax}
                        onChange={(e) => onPriceMaxChange(e.target.value)}
                    />
                </div>
                <button className="filter-button" onClick={onApplyFilters}>
                    Aplicar
                </button>
            </div>

            {/* Location Filter */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">Ubicación</h3>
                <input
                    type="text"
                    placeholder="Ciudad o región..."
                    value={location}
                    onChange={(e) => onLocationChange(e.target.value)}
                    style={{ marginBottom: 0 }}
                />
            </div>

            {/* Shipping Filter */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">Envío</h3>
                <ul className="sidebar-list">
                    <li>
                        <button>
                            <span>🚚 Envío gratis</span>
                        </button>
                    </li>
                    <li>
                        <button>
                            <span>⚡ Llega mañana</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* Condition Filter */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">Condición</h3>
                <ul className="sidebar-list">
                    <li><button>🆕 Nuevo</button></li>
                    <li><button>♻️ Usado</button></li>
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar
