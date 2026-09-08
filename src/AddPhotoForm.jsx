import { useState } from 'react'

function AddPhotoForm({ onAddPhoto }) {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  function handleFileChange(e) {
    setFile(e.target.files[0] || null)
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!file) {
      setError('Please choose an image file first.')
      return
    }

    // FileReader turns the chosen image into a base64 "data URL"
    // string, which we can store in localStorage and use directly
    // as an <img src="..."> value.
    const reader = new FileReader()
    reader.onload = () => {
      onAddPhoto({
        id: Date.now(),
        title: title.trim() || 'Untitled',
        url: reader.result,
      })
      setTitle('')
      setFile(null)
      e.target.reset()
      setError('')
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
        />
      </div>

      <button type="submit" className="btn btn-brass">
        Add photo
      </button>

      {error && <div className="login-error">{error}</div>}
    </form>
  )
}

export default AddPhotoForm
