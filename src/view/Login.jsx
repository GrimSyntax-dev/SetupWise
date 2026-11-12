import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Más adelante conectaremos el inicio de sesión con PHP y MySQL.
  };

  return (
    <main className="login-page">

      {/* Decoraciones de las esquinas */}
      <div className="corner corner-top"></div>
      <div className="corner corner-bottom"></div>

      {/* LADO IZQUIERDO */}
      <section className="login-left">

        <header className="login-brand">
          <img src="/images/logo-setupwise.png" alt="Logo SetupWise" />
          <span>Setup<span>Wise</span></span>
        </header>

        <div className="login-presentation">
          <h1>
            Tu setup gamer,
            <br />
            <span>sin gastar de más</span>
          </h1>

          <p className="presentation-description">
            Encuentra los mejores accesorios, compara
            <br className="desktop-break" />
            precios y arma el setup ideal según tu presupuesto.
          </p>

          <div className="features">

            <div className="feature">
              <div className="feature-icon">♧</div>
              <span> Crea tu setup<br />por presupuesto</span>
            </div>

            <div className="feature">
              <div className="feature-icon">⌕</div>
              <span>Compara<br />productos</span>
            </div>

            <div className="feature">
              <div className="feature-icon">♧</div>
              <span>Descubre<br />promociones</span>
            </div>

          </div>
        </div>

        <footer className="login-left-footer">
          <div className="footer-line"></div>
          <p>
            GAMING SETUPS <span>•</span> TECNOLOGÍA
            <span>•</span> PRESUPUESTOS INTELIGENTES
          </p>
        </footer>

      </section>

      {/* LADO DERECHO */}
      <section className="login-right">

        <div className="login-card">

          <div className="card-brand">
            <img src="/images/logo-setupwise.png" alt="Logo SetupWise" />
            <span>SetupWise</span>
          </div>

          <div className="card-heading">
            <h2>Bienvenido</h2>
            <p>Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* CORREO */}
            <div className="login-input">
              <span className="input-icon">✉</span>

              <div className="input-content">
                <label htmlFor="email">Correo electrónico o usuario</label>
                <input
                  type="text"
                  id="email"
                  placeholder="usuario@ejemplo.com"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* CONTRASEÑA */}
            <div className="login-input">
              <span className="input-icon">♙</span>

              <div className="input-content">
                <label htmlFor="password">Contraseña</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "◉" : "◎"}
              </button>
            </div>

            {/* OPCIONES */}
            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>

              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>

            {/* BOTÓN PRINCIPAL */}
            <button type="submit" className="login-submit">
              <span>→</span>
              Iniciar sesión
            </button>

            {/* SEPARADOR */}
            <div className="login-divider">
              <span></span>
              <p>O</p>
              <span></span>
            </div>

            {/* GOOGLE */}
            <button type="button" className="google-button">
              <strong>G</strong>
              Continuar con Google
            </button>

          </form>

          <div className="register-text">
            ¿No tienes una cuenta?
            <Link to="/registro">Regístrate</Link>
          </div>

        </div>

      </section>

    </main>
  );
}

export default Login;
