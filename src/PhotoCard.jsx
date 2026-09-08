function PhotoCard({ photo, onRemove }) {
  return (
    <div className="photo-card">
      <div className="frame">
        <img src={photo.url} alt={photo.title} />
      </div>
      <div className="photo-card-footer">
        <span className="photo-title">{photo.title}</span>
        <button className="btn-danger" onClick={() => onRemove(photo.id)}>
          Remove
        </button>
      </div>
    </div>
  )
}

export default PhotoCard
