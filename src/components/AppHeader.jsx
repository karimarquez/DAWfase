export function AppHeader({ currentUser, onNavigate, onLogout }) {
  return (
    <header className="navbar">
      <div className="brand-logo">Aesthetica</div>
      <nav>
        <ul className="nav-links">
          <li><button onClick={() => onNavigate('home')}>Inicio</button></li>
          <li><button onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}>Servicios</button></li>
          <li><button onClick={() => onNavigate('booking')}>Reservar</button></li>
          {currentUser?.role === 'admin' ? (
            <>
              <li><button onClick={() => onNavigate('admin')}>Admin</button></li>
              <li><button className="btn-primary" onClick={onLogout}>Cerrar sesión</button></li>
            </>
          ) : currentUser ? (
            <>
              <li><button onClick={() => onNavigate('appointments')}>Mis citas</button></li>
              <li><button className="btn-primary" onClick={onLogout}>Cerrar sesión</button></li>
            </>
          ) : (
            <li><button className="btn-primary" onClick={() => onNavigate('login')}>Iniciar sesión</button></li>
          )}
        </ul>
      </nav>
    </header>
  );
}
