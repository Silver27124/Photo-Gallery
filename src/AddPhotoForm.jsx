import { useState } from 'react'

function AddPhotoForm({ onAddPhoto }) {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleFileChange(e) {
    setFile(e.target.files[0] || null)
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!file) {
      setError('Please choose an image file first.')
      return
    }

    setIsSubmitting(true)
    setError('')

    const reader = new FileReader()
    reader.onerror = () => {
      setError('Could not read image file.')
      setIsSubmitting(false)
    }

    reader.onload = async () => {
      try {
        await onAddPhoto({
          title: title.trim() || 'Untitled',
          url: reader.result,
        })
        setTitle('')
        setFile(null)
        e.target.reset()
        setError('')
      } catch (err) {
        setError(err.message || 'Failed to add photo.')
      } finally {
        setIsSubmitting(false)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <form className="add-photo-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="photo-title">Title</label>
        <input
          id="photo-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your photo a name"
          disabled={isSubmitting}
        />
      </div>

      <div className="field">
        <label htmlFor="photo-file">Image file</label>
        <input
          id="photo-file"
          className="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isSubmitting}
        />
      </div>

      <button type="submit" className="btn btn-brass" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Add photo'}
      </button>

      {error && <div className="login-error">{error}</div>}
    </form>
  )
}

export default AddPhotoForm
