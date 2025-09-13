import React, { useEffect, useRef } from 'react'

// @ts-ignore - Legacy JS modules
import { ClientP4, canvasInterface } from '../lib/class/ClientP4.js'

interface GameCanvasProps {
  roomId: string
  onPlayerStateChange: (playerNumber: number, active: boolean) => void
}

const GameCanvas: React.FC<GameCanvasProps> = ({ roomId, onPlayerStateChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<any>(null)
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Backend URL configuration
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'ws://localhost:3000'
    const wsUrl = `${BACKEND_URL.replace('http', 'ws')}/P4`

    // Create WebSocket connection
    const socket = new WebSocket(wsUrl, ['ws', 'wss'])
    socketRef.current = socket

    // Initialize game components
    const game = new ClientP4(socket)
    const gameInterface = new canvasInterface(
      canvasRef.current,
      game,
      {
        colors: ['#dc3545', '#ffc107'],
        width: 800,
        height: 600,
        static: false,
        onPlayerUpdate: (playerNumber: number, active: boolean) => {
          onPlayerStateChange(playerNumber, active)
        }
      }
    )

    gameRef.current = { game, gameInterface }

    // Socket event handlers
    const handleSocketOpen = () => {
      game.join(roomId)
      
      // Keep-alive ping
      const pingInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send('ping')
        }
      }, 30000)

      // Cleanup on close
      const handleSocketClose = () => {
        clearInterval(pingInterval)
        console.log('WebSocket connection closed')
      }

      socket.addEventListener('close', handleSocketClose)
    }

    const handleSocketError = (error: Event) => {
      console.error('WebSocket error:', error)
    }

    const handleSocketMessage = (event: MessageEvent) => {
      // Handle incoming messages
      try {
        const data = JSON.parse(event.data)
        // Game logic will handle the messages
      } catch (error) {
        // Handle non-JSON messages
        if (event.data !== 'pong') {
          console.log('Received:', event.data)
        }
      }
    }

    socket.addEventListener('open', handleSocketOpen)
    socket.addEventListener('error', handleSocketError)
    socket.addEventListener('message', handleSocketMessage)

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [roomId, onPlayerStateChange])

  return (
    <div className="game-canvas-container">
      <canvas 
        ref={canvasRef}
        id="canvas"
        className="mw-100 border border-secondary rounded"
        style={{ 
          maxWidth: '100%', 
          height: 'auto',
          backgroundColor: '#f8f9fa'
        }}
      />
    </div>
  )
}

export default GameCanvas