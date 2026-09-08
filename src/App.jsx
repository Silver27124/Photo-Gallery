import { useState, useEffect } from 'react'
import Navbar from './Navbar.jsx'
import Login from './Login.jsx'
import Gallery from './Gallery.jsx'

function App() {
  // Holds the logged-in username, or null if nobody is logged in.
  // We read from localStorage first so the user stays logged in
  // even after refreshing the page.
  const [user, setUser] = useState(() => {
    return localStorage.getItem('galleryUser') || null
  })

  // Whenever "user" changes, save it to localStorage (or remove it).
  useEffect(() => {
    if (user) {
      localStorage.setItem('galleryUser', user)
    } else {
      localStorage.removeItem('galleryUser')
    }
  }, [user])

  function handleLogin(username) {
    setUser(username)
  }

  function handleLogout() {
    setUser(null)
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      {user ? (
        <Gallery user={user} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  )
}

export default App
