import React, { useEffect, useRef } from 'react'

interface GameCanvasProps {
  roomId: string
  onPlayerStateChange: (playerNumber: number, active: boolean) => void
}

const GameCanvas: React.FC<GameCanvasProps> = ({ roomId, onPlayerStateChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    if (ctx) {
      // Draw a simple game board placeholder
      ctx.fillStyle = '#f8f9fa'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw Connect 4 grid
      const rows = 6
      const cols = 7
      const cellSize = Math.min(canvas.width / cols, canvas.height / rows)
      const offsetX = (canvas.width - cols * cellSize) / 2
      const offsetY = (canvas.height - rows * cellSize) / 2
      
      ctx.strokeStyle = '#343a40'
      ctx.lineWidth = 2
      
      // Draw grid lines
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath()
        ctx.moveTo(offsetX + i * cellSize, offsetY)
        ctx.lineTo(offsetX + i * cellSize, offsetY + rows * cellSize)
        ctx.stroke()
      }
      
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath()
        ctx.moveTo(offsetX, offsetY + i * cellSize)
        ctx.lineTo(offsetX + cols * cellSize, offsetY + i * cellSize)
        ctx.stroke()
      }

      // Draw some sample pieces
      ctx.fillStyle = '#dc3545'
      ctx.beginPath()
      ctx.arc(offsetX + cellSize * 0.5, offsetY + cellSize * 5.5, cellSize * 0.3, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#ffc107'
      ctx.beginPath()
      ctx.arc(offsetX + cellSize * 1.5, offsetY + cellSize * 5.5, cellSize * 0.3, 0, Math.PI * 2)
      ctx.fill()

      // Add text
      ctx.fillStyle = '#6c757d'
      ctx.font = '24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('P4 Game Board - React Version', canvas.width / 2, 30)
      ctx.font = '16px Arial'
      ctx.fillText(`Room: ${roomId}`, canvas.width / 2, 55)
    }

    // Basic WebSocket connection (commented out for demonstration)
    // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'ws://localhost:3000'
    // const wsUrl = `${BACKEND_URL.replace('http', 'ws')}/P4`

    // Simulate player state changes without WebSocket for demo
    setTimeout(() => onPlayerStateChange(1, true), 1000)
    setTimeout(() => onPlayerStateChange(2, false), 1500)

    // Commented out WebSocket connection for now
    /*
    try {
      const socket = new WebSocket(wsUrl, ['ws', 'wss'])
      socketRef.current = socket

      socket.onopen = () => {
        console.log('WebSocket connected to room:', roomId)
        // Simulate player state changes
        setTimeout(() => onPlayerStateChange(1, true), 1000)
        setTimeout(() => onPlayerStateChange(2, false), 1500)
      }

      socket.onerror = (error) => {
        console.log('WebSocket connection error:', error)
      }

      socket.onclose = () => {
        console.log('WebSocket disconnected')
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
    }
    */

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [roomId, onPlayerStateChange])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    console.log(`Canvas clicked at: ${x}, ${y}`)
    // Here you would handle the game move logic
  }

  return (
    <div className="game-canvas-container">
      <canvas 
        ref={canvasRef}
        className="mw-100 border border-secondary rounded"
        style={{ 
          maxWidth: '100%', 
          height: 'auto',
          cursor: 'pointer'
        }}
        onClick={handleCanvasClick}
      />
    </div>
  )
}

export default GameCanvas