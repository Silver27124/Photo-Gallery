function Navbar({ user, onLogout }) {
  return (
    <div className="navbar">
      <div className="navbar-brand">
        <h1>Gallery</h1>
      </div>

      {user && (
        <div className="navbar-right">
          <span className="navbar-user">{user}</span>
          <button className="btn btn-outline" onClick={onLogout}>
            Log out
          </button>
        </div>
      )}
    </div>
  )
}

export default Navbar
