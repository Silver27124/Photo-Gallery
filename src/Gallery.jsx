import { useState, useEffect } from 'react'
import AddPhotoForm from './AddPhotoForm.jsx'
import PhotoCard from './PhotoCard.jsx'

function Gallery({ user }) {
  const storageKey = `galleryPhotos_${user}`

  // Load this user's saved photos from localStorage when the
  // component first renders.
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : []
  })

  // Every time the photo list changes, save it back to localStorage
  // so it's still there next time the user logs in.
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(photos))
  }, [photos, storageKey])

  function handleAddPhoto(photo) {
    setPhotos((prev) => [photo, ...prev])
  }

  function handleRemovePhoto(id) {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id))
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <div>
          <h2>Your photos</h2>
          <p>{photos.length} photo{photos.length !== 1 ? 's' : ''} in this gallery</p>
        </div>
      </div>

      <AddPhotoForm onAddPhoto={handleAddPhoto} />

      {photos.length === 0 ? (
        <div className="empty-state">
          <h3>No photos yet</h3>
          <p>Use the form above to add your first photo.</p>
        </div>
      ) : (
        <div className="photo-grid">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} onRemove={handleRemovePhoto} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Gallery
