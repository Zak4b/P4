import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { apiClient } from '../api'
import RoomManager from './RoomManager'
import GameModal from './GameModal'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showRooms, setShowRooms] = useState(false)

  useEffect(() => {
    checkLoginStatus()
  }, [])

  const checkLoginStatus = async () => {
    try {
      const status = await apiClient.getLoginStatus()
      setIsLoggedIn(status.isLoggedIn)
    } catch (error) {
      console.error('Failed to check login status:', error)
      setIsLoggedIn(false)
    }
  }

  const handleLogout = async () => {
    try {
      await apiClient.logout()
      setIsLoggedIn(false)
      window.location.reload()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="container" style={{ paddingTop: '85px' }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top bg-dark border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">P4 Game</NavLink>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  to="/"
                >
                  Game
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  to="/history"
                >
                  History
                </NavLink>
              </li>
              {isLoggedIn && (
                <li className="nav-item">
                  <button 
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                    style={{ border: 'none', background: 'none' }}
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
            <button 
              className="btn btn-primary" 
              type="button" 
              data-bs-toggle="offcanvas" 
              data-bs-target="#offcanvas" 
              aria-controls="offcanvas"
              onClick={() => setShowRooms(true)}
            >
              Rooms
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Room Manager OffCanvas */}
      <RoomManager show={showRooms} onHide={() => setShowRooms(false)} />
      
      {/* Game Modal */}
      <GameModal />
    </div>
  )
}

export default Layout