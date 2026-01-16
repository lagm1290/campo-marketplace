import { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const LoginPage = () => {
    const { loginUser } = useContext(AuthContext)

    return (
        <div className="main-container">
            <div className="auth-page">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '48px' }}>🌾</span>
                    <h1>Ingresar a Campo</h1>
                </div>
                <form onSubmit={loginUser}>
                    <div className="form-group">
                        <label>Usuario</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Ingresá tu usuario"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Ingresá tu contraseña"
                            required
                        />
                    </div>
                    <button type="submit">Ingresar</button>
                </form>
                <div className="auth-link">
                    ¿No tenés cuenta? <Link to="/register">Crear cuenta</Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
