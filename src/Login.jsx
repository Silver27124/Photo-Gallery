import { useState } from 'react'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both a username and a password.')
      return
    }

    setError('')
    onLogin(username.trim())
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p className="login-sub">Log in to manage your photo gallery.</p>

        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. jane"
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="btn btn-brass">
          Log in
        </button>

    
      </form>
    </div>
  )
}

export default Login
