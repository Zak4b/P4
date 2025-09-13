import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import GameCanvas from './GameCanvas'
import MessageArea from './MessageArea'
import LoginForm from './LoginForm'
import { apiClient } from '../api'

const GamePage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [playerStates, setPlayerStates] = useState({
    player1: { active: false, name: 'Joueur #1' },
    player2: { active: false, name: 'Joueur #2' }
  })

  const roomId = searchParams.get('roomId') || '1'

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const status = await apiClient.getLoginStatus()
      setIsLoggedIn(status.isLoggedIn)
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsLoggedIn(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    setIsLoggedIn(true)
  }

  const handlePlayerStateChange = (playerNumber: number, active: boolean) => {
    setPlayerStates(prev => ({
      ...prev,
      [`player${playerNumber}`]: {
        ...prev[`player${playerNumber}` as keyof typeof prev],
        active
      }
    }))
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="row">
      <div className="col-lg-7 col-12">
        <GameCanvas 
          roomId={roomId} 
          onPlayerStateChange={handlePlayerStateChange}
        />
        <div className="container-fluid d-flex justify-content-evenly bg-dark p-2 rounded-4 mt-3">
          <div 
            className={`btn disabled ${playerStates.player1.active ? 'btn-danger' : 'btn-outline-danger'}`}
          >
            {playerStates.player1.name}
          </div>
          <div 
            className={`btn disabled ${playerStates.player2.active ? 'btn-warning' : 'btn-outline-warning'}`}
          >
            {playerStates.player2.name}
          </div>
        </div>
      </div>
      <div className="col-lg-5 col-12 d-flex flex-column">
        <MessageArea roomId={roomId} />
      </div>
    </div>
  )
}

export default GamePage