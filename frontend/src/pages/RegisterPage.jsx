import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        is_seller: false
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setFormData({ ...formData, [e.target.name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('/auth/register/', formData)
            navigate('/login')
        } catch (error) {
            alert('Error al registrar. Intentá de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="main-container">
            <div className="auth-page">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '48px' }}>🌾</span>
                    <h1>Crear cuenta</h1>
                    <p style={{ color: '#666', marginTop: '8px' }}>
                        Unite al marketplace agrícola más grande
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Usuario</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Elegí tu nombre de usuario"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="tu@email.com"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Mínimo 6 caracteres"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            padding: '16px',
                            background: formData.is_seller ? '#E8F2FF' : '#f5f5f5',
                            borderRadius: '6px',
                            border: formData.is_seller ? '2px solid #3483FA' : '2px solid transparent'
                        }}>
                            <input
                                type="checkbox"
                                name="is_seller"
                                onChange={handleChange}
                                style={{ width: 'auto', margin: 0 }}
                            />
                            <div>
                                <strong style={{ color: '#333' }}>Quiero vender productos</strong>
                                <p style={{ fontSize: '13px', color: '#666', margin: '4px 0 0' }}>
                                    Activá tu cuenta de vendedor y empezá a publicar
                                </p>
                            </div>
                        </label>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>
                <div className="auth-link">
                    ¿Ya tenés cuenta? <Link to="/login">Ingresar</Link>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
