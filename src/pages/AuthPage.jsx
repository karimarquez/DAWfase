export function AuthPage({
  authMode,
  setAuthMode,
  loginForm,
  setLoginForm,
  registerForm,
  setRegisterForm,
  onLogin,
  onRegister,
}) {
  return (
    <main className="container auth-container section-block">
      <div className="selection-box auth-box">
        <div className="auth-tabs">
          <button type="button" className={authMode === 'login' ? 'tab active' : 'tab'} onClick={() => setAuthMode('login')}>Iniciar sesión</button>
          <button type="button" className={authMode === 'register' ? 'tab active' : 'tab'} onClick={() => setAuthMode('register')}>Registrarse</button>
        </div>

        {authMode === 'login' ? (
          <form onSubmit={onLogin}>
            <h2>Acceso a tu cuenta</h2>
            <p className="form-hint">Cuentas de demostración: admin@aesthetica.com / admin123 · cliente@aesthetica.com / cliente123</p>
            <div className="form-group auth-group">
              <label htmlFor="login-email">Correo electrónico</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                placeholder="usuario@ejemplo.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="form-group auth-group">
              <label htmlFor="login-password">Contraseña</label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                placeholder="••••••••"
                autoComplete="current-password"
                minLength={8}
                required
              />
            </div>
            <button className="btn-primary auth-button" type="submit">Ingresar</button>
          </form>
        ) : (
          <form onSubmit={onRegister}>
            <h2>Crear cuenta</h2>
            <div className="form-group auth-group">
              <label htmlFor="register-name">Nombre</label>
              <input
                id="register-name"
                type="text"
                className="form-input"
                value={registerForm.name}
                onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })}
                placeholder="Tu nombre"
                minLength={2}
                maxLength={80}
                autoComplete="name"
                required
              />
            </div>
            <div className="form-group auth-group">
              <label htmlFor="register-email">Correo electrónico</label>
              <input
                id="register-email"
                type="email"
                className="form-input"
                value={registerForm.email}
                onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                placeholder="correo@ejemplo.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="form-group auth-group">
              <label htmlFor="register-password">Contraseña</label>
              <input
                id="register-password"
                type="password"
                className="form-input"
                value={registerForm.password}
                onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                placeholder="8 caracteres, mayúscula, minúscula y número"
                minLength={8}
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}"
                autoComplete="new-password"
                required
              />
            </div>
            <div className="form-group auth-group">
              <label htmlFor="register-confirm-password">Confirmar contraseña</label>
              <input
                id="register-confirm-password"
                type="password"
                className="form-input"
                value={registerForm.confirmPassword}
                onChange={(event) => setRegisterForm({ ...registerForm, confirmPassword: event.target.value })}
                placeholder="Repite tu contraseña"
                minLength={8}
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}"
                autoComplete="new-password"
                required
              />
            </div>
            <button className="btn-primary auth-button" type="submit">Registrarme</button>
          </form>
        )}
      </div>
    </main>
  );
}
