import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-section">
                        <h4>Acerca de</h4>
                        <ul>
                            <li><Link to="/">Quiénes somos</Link></li>
                            <li><Link to="/">Términos y condiciones</Link></li>
                            <li><Link to="/">Cómo cuidamos tu privacidad</Link></li>
                            <li><Link to="/">Accesibilidad</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Ayuda</h4>
                        <ul>
                            <li><Link to="/">Comprar</Link></li>
                            <li><Link to="/">Vender</Link></li>
                            <li><Link to="/">Resolución de problemas</Link></li>
                            <li><Link to="/">Centro de seguridad</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Pagos</h4>
                        <ul>
                            <li><Link to="/">Mercado Pago</Link></li>
                            <li><Link to="/">Tarjetas de crédito</Link></li>
                            <li><Link to="/">Transferencias</Link></li>
                            <li><Link to="/">Promociones</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Síguenos</h4>
                        <ul>
                            <li><Link to="/">Facebook</Link></li>
                            <li><Link to="/">Instagram</Link></li>
                            <li><Link to="/">Twitter</Link></li>
                            <li><Link to="/">YouTube</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 Campo Marketplace. Todos los derechos reservados.</p>
                    <p>Tu marketplace de productos agrícolas de confianza 🌾</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
