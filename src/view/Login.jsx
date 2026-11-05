
import "../assets/css/Login.css";

function Login() {
  return (
    <main className="login-page">

      {/* Panel izquierdo */}
      <section className="login-banner">
        <div className="brand">
          <span className="brand-icon">S</span>
          <span>SetupWise</span>
        </div>

        <div className="banner-content">
          <span className="banner-tag">GAMING SETUPS · SMART BUDGETS</span>

          <h1>
            Tu setup ideal.
            <br />
            <span>Tu presupuesto.</span>
            <br />
            Tus reglas.
          </h1>

          <p>
            Encuentra, compara y elige los mejores accesorios
            para construir tu setup gamer sin gastar de más.
          </p>

          <div className="banner-decoration">
            <div className="decoration-line"></div>
            <span>CONSTRUYE TU SETUP CON INTELIGENCIA</span>
          </div>
        </div>

        <div className="banner-footer">
          <span>SETUPWISE © 2026</span>
          <span>GAMING · TECHNOLOGY · BUDGET</span>
        </div>
      </section>

      {/* Panel derecho */}
      <section className="login-form-section">
        <div className="login-card">

          <div className="login-heading">
            <span className="welcome-tag">BIENVENIDO DE NUEVO</span>
            <h2>Iniciar sesión</h2>
            <p>Ingresa tus datos para continuar en SetupWise.</p>
          </div>

          <form className="login-form">

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>

            <div className="form-group">
              <div className="password-label">
                <label htmlFor="password">Contraseña</label>
                <a href="#">¿Olvidaste tu contraseña?</a>
              </div>

              <input
                type="password"
                id="password"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            <div className="login-options">
              <label className="remember-option">
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>
            </div>

            <button type="submit" className="login-button">
              Iniciar sesión
              <span>→</span>
            </button>

          </form>

          <div className="register-link">
            ¿Todavía no tienes una cuenta?
            <a href="#"> Crear cuenta</a>
          </div>

          <div className="login-security">
            <span className="security-dot"></span>
            Tu experiencia gamer comienza aquí.
          </div>

        </div>
      </section>

    </main>
  );
}

export default Login;
