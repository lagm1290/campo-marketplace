import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const CreateProductPage = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        location: '',
        condition: 'NEW',
        image: null
    })
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/categories/')
            .then(res => setCategories(res.data.results || res.data))
            .catch(err => console.error(err))
    }, [])

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({ ...formData, image: e.target.files[0] })
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const data = new FormData()
        for (const key in formData) {
            if (formData[key] !== null) {
                data.append(key, formData[key])
            }
        }

        try {
            await api.post('/products/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            navigate('/')
        } catch (error) {
            alert('Error al publicar el producto')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="main-container">
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '6px',
                    marginBottom: '16px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                }}>
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
                        Publicar un producto
                    </h1>
                    <p style={{ margin: '8px 0 0', color: '#666' }}>
                        Completá los datos de tu producto para comenzar a vender
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '6px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                }}>
                    {/* Product Name */}
                    <div className="form-group">
                        <label>Nombre del producto *</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Ej: Semillas de maíz premium"
                            required
                            onChange={handleChange}
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>Descripción *</label>
                        <textarea
                            name="description"
                            placeholder="Describí tu producto en detalle: características, cantidad, calidad..."
                            rows="4"
                            required
                            onChange={handleChange}
                            style={{ resize: 'vertical', minHeight: '100px' }}
                        />
                    </div>

                    {/* Price and Stock */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label>Precio (USD) *</label>
                            <input
                                type="number"
                                name="price"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Stock disponible *</label>
                            <input
                                type="number"
                                name="stock"
                                placeholder="0"
                                min="1"
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Category and Condition */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label>Categoría *</label>
                            <select
                                name="category"
                                required
                                onChange={handleChange}
                                defaultValue=""
                            >
                                <option value="" disabled>Seleccionar categoría</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Condición</label>
                            <select
                                name="condition"
                                onChange={handleChange}
                                value={formData.condition}
                            >
                                <option value="NEW">🆕 Nuevo</option>
                                <option value="USED">♻️ Usado</option>
                            </select>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="form-group">
                        <label>Ubicación</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="Ej: Buenos Aires, Argentina"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Image */}
                    <div className="form-group">
                        <label>Imagen del producto</label>
                        <div style={{
                            border: '2px dashed #ddd',
                            borderRadius: '6px',
                            padding: '24px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: '#fafafa'
                        }}>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                style={{ margin: 0 }}
                            />
                            <p style={{ margin: '8px 0 0', color: '#666', fontSize: '13px' }}>
                                JPG, PNG o GIF • Máximo 5MB
                            </p>
                        </div>
                    </div>

                    {/* Submit */}
                    <div style={{ marginTop: '24px' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '16px',
                                fontSize: '16px',
                                fontWeight: 600,
                                background: '#3483FA',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Publicando...' : 'Publicar producto'}
                        </button>
                    </div>

                    {/* Info */}
                    <p style={{
                        marginTop: '16px',
                        textAlign: 'center',
                        color: '#666',
                        fontSize: '13px'
                    }}>
                        Al publicar aceptás los términos y condiciones del marketplace
                    </p>
                </form>
            </div>
        </div>
    )
}

export default CreateProductPage
