import { useState, useEffect } from 'react'
import AddPhotoForm from './AddPhotoForm.jsx'
import PhotoCard from './PhotoCard.jsx'

function Gallery({ user }) {
  const [photos, setPhotos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [dbConnected, setDbConnected] = useState(false)

  // Fetch user photos from MongoDB backend
  useEffect(() => {
    let isMounted = true

    async function loadPhotos() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const res = await fetch(`/photos?user=${encodeURIComponent(user)}`)
        
        let data
        const text = await res.text()
        try {
          data = text ? JSON.parse(text) : null
        } catch {
          throw new Error('Could not connect to backend server. Make sure "npm run dev" was restarted.')
        }

        if (!res.ok) {
          throw new Error(data?.error || `Server responded with status ${res.status}`)
        }

        if (isMounted) {
          setPhotos(data || [])
          setDbConnected(true)
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.message)
          setDbConnected(false)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPhotos()

    return () => {
      isMounted = false
    }
  }, [user])

  // Save new photo to MongoDB
  async function handleAddPhoto(photoData) {
    const res = await fetch('/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: photoData.title,
        url: photoData.url,
        user: user,
      }),
    })

    let data
    const text = await res.text()
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      throw new Error('Backend server is unreachable. Please restart "npm run dev".')
    }

    if (!res.ok) {
      throw new Error(data?.error || 'Failed to save photo to MongoDB.')
    }

    setPhotos((prev) => [data, ...prev])
    setErrorMessage(null)
    setDbConnected(true)
  }

  // Remove photo from MongoDB
  async function handleRemovePhoto(id) {
    try {
      const res = await fetch(`/photos/${id}`, {
        method: 'DELETE',
      })
      let data
      const text = await res.text()
      try {
        data = text ? JSON.parse(text) : null
      } catch {
        throw new Error('Backend server is unreachable.')
      }

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to delete photo.')
      }

      setPhotos((prev) => prev.filter((photo) => (photo._id || photo.id) !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <div>
          <h2>Your photos</h2>
          <p>
            {photos.length} photo{photos.length !== 1 ? 's' : ''} stored in MongoDB
          </p>
          {dbConnected && (
            <div className="db-connected-badge">
              <span>●</span> MongoDB Connected
            </div>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="db-alert">
          <strong>Database Notice:</strong> {errorMessage}
          <div style={{ marginTop: '8px' }}>
            To connect to MongoDB Atlas for free: paste your connection string into the <code>.env</code> file:
            <br />
            <code>MONGODB_URI=mongodb+srv://&lt;user&gt;:&lt;password&gt;@cluster0.xxx.mongodb.net/photo_gallery</code>
          </div>
        </div>
      )}

      <AddPhotoForm onAddPhoto={handleAddPhoto} />

      {isLoading ? (
        <div className="empty-state">
          <h3>Loading gallery from MongoDB...</h3>
        </div>
      ) : photos.length === 0 ? (
        <div className="empty-state">
          <h3>No photos yet</h3>
          <p>Use the form above to add your first photo to MongoDB.</p>
        </div>
      ) : (
        <div className="photo-grid">
          {photos.map((photo) => (
            <PhotoCard
              key={photo._id || photo.id}
              photo={photo}
              onRemove={handleRemovePhoto}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Gallery

