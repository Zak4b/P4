import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Room {
  id: string
  name: string
  playerCount: number
  maxPlayers: number
  status: 'waiting' | 'playing' | 'finished'
}

interface RoomManagerProps {
  show: boolean
  onHide: () => void
}

const RoomManager: React.FC<RoomManagerProps> = ({ show, onHide }) => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [newRoomName, setNewRoomName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showNewRoomForm, setShowNewRoomForm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (show) {
      loadRooms()
    }
  }, [show])

  const loadRooms = async () => {
    setIsLoading(true)
    try {
      // This would call the actual API in a real implementation
      // const response = await apiClient.getRooms()
      // setRooms(response.data || [])
      
      // Mock data for now
      setRooms([
        {
          id: '1',
          name: 'Room 1',
          playerCount: 1,
          maxPlayers: 2,
          status: 'waiting'
        },
        {
          id: '2',
          name: 'Room 2',
          playerCount: 2,
          maxPlayers: 2,
          status: 'playing'
        },
        {
          id: '3',
          name: 'Completed Game',
          playerCount: 0,
          maxPlayers: 2,
          status: 'finished'
        }
      ])
    } catch (error) {
      console.error('Failed to load rooms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinRoom = (roomId: string) => {
    navigate(`/?roomId=${roomId}`)
    onHide()
  }

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomName.trim()) return

    try {
      // This would call the actual API in a real implementation
      // await apiClient.createRoom(newRoomName)
      
      // For now, just navigate to the new room
      navigate(`/?roomId=${newRoomName}`)
      setNewRoomName('')
      setShowNewRoomForm(false)
      onHide()
    } catch (error) {
      console.error('Failed to create room:', error)
    }
  }

  const getStatusBadgeClass = (status: Room['status']) => {
    switch (status) {
      case 'waiting': return 'bg-warning'
      case 'playing': return 'bg-success'
      case 'finished': return 'bg-secondary'
      default: return 'bg-secondary'
    }
  }

  const getStatusText = (status: Room['status']) => {
    switch (status) {
      case 'waiting': return 'En attente'
      case 'playing': return 'En cours'
      case 'finished': return 'Terminée'
      default: return 'Inconnu'
    }
  }

  return (
    <div 
      className={`offcanvas offcanvas-start ${show ? 'show' : ''}`}
      tabIndex={-1}
      style={{ visibility: show ? 'visible' : 'hidden' }}
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">Rooms</h5>
        <button 
          type="button" 
          className="btn-close" 
          aria-label="Close"
          onClick={onHide}
        />
      </div>
      <div className="offcanvas-body">
        {/* New Room Button */}
        <div className="mb-3">
          {!showNewRoomForm ? (
            <button 
              className="btn btn-info w-100"
              onClick={() => setShowNewRoomForm(true)}
            >
              Nouvelle Salle
            </button>
          ) : (
            <form onSubmit={handleCreateRoom}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nom de la salle"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  autoFocus
                />
                <button className="btn btn-outline-primary" type="submit">
                  Créer
                </button>
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={() => {
                    setShowNewRoomForm(false)
                    setNewRoomName('')
                  }}
                >
                  ✕
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Rooms List */}
        {isLoading ? (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <ul className="list-group">
            {rooms.map(room => (
              <li key={room.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex flex-column">
                  <div className="fw-bold">{room.name}</div>
                  <small className="text-muted">
                    {room.playerCount}/{room.maxPlayers} joueurs
                  </small>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <span className={`badge ${getStatusBadgeClass(room.status)} mb-1`}>
                    {getStatusText(room.status)}
                  </span>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleJoinRoom(room.id)}
                    disabled={room.status === 'finished'}
                  >
                    {room.status === 'finished' ? 'Terminée' : 'Rejoindre'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Refresh Button */}
        <div className="mt-3">
          <button 
            className="btn btn-outline-secondary w-100"
            onClick={loadRooms}
            disabled={isLoading}
          >
            Actualiser
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomManager