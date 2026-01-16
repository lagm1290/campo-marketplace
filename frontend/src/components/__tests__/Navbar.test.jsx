import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import CartContext from '../../context/CartContext'
import Navbar from '../Navbar'

// Mock Link since it's used in Navbar
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        Link: ({ children, to }) => <a href={to}>{children}</a>
    }
})

describe('Navbar Component', () => {
    const mockLogout = vi.fn()

    it('renders login/register links when not logged in', () => {
        const authValue = { user: null, logoutUser: mockLogout }
        const cartValue = { cartCount: 0 }

        render(
            <AuthContext.Provider value={authValue}>
                <CartContext.Provider value={cartValue}>
                    <Navbar />
                </CartContext.Provider>
            </AuthContext.Provider>
        )

        expect(screen.getByText(/Login/i)).toBeInTheDocument()
        expect(screen.getByText(/Register/i)).toBeInTheDocument()
        expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument()
    })

    it('renders user specific links when logged in as seller', () => {
        const user = { username: 'seller', is_seller: true }
        const authValue = { user: user, logoutUser: mockLogout }
        const cartValue = { cartCount: 2 }

        render(
            <AuthContext.Provider value={authValue}>
                <CartContext.Provider value={cartValue}>
                    <Navbar />
                </CartContext.Provider>
            </AuthContext.Provider>
        )

        expect(screen.getByText(/Sell Product/i)).toBeInTheDocument()
        expect(screen.getByText(/Cart \(2\)/i)).toBeInTheDocument()
    })
})
