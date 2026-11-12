import { useState } from "react";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Star,
    Tag,
    ShieldCheck,
    Check,
    ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import "../assets/css/Register.css";

function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
            <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
        </svg>
    );
}

function Brand() {
    return (
        <div className="register-brand">
            <img src="/images/logo-setupwise.png" alt="" />
            <span>
                Setup<span className="brand-accent">Wise</span>
            </span>
        </div>
    );
}

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (!acceptedTerms) {
            setError("Debes aceptar los Términos y Condiciones.");
            return;
        }

        // Más adelante aquí conectaremos el registro con PostgreSQL.
        setRegistered(true);
    };

    const handleGoogle = () => {
        // Pendiente: autenticación con Google.
    };

    return (
        <main className="register-page">
            <div className="register-overlay"></div>

            <div className="register-wrapper">
                {/* ---------- Header ---------- */}
                <header className="register-topbar">
                    <Brand />

                    <p className="register-topbar-login">
                        ¿Ya tienes una cuenta?
                        <Link to="/">Iniciar sesión</Link>
                    </p>
                </header>

                <div className="register-layout">
                    {/* ---------- Columna izquierda ---------- */}
                    <aside className="register-info">
                        <h1>
                            Crea tu cuenta y{" "}
                            <span className="gradient-text">
                                lleva tu setup al siguiente nivel
                            </span>
                        </h1>

                        <p className="register-info-text">
                            Accede a recomendaciones personalizadas, compara
                            productos y crea tu lista de compras según tu
                            presupuesto.
                        </p>

                        <ul className="register-benefits">
                            <li>
                                <span className="benefit-icon"><Star size={22} /></span>
                                <div>
                                    <strong>Recomendaciones</strong>
                                    <small>basadas en tus preferencias</small>
                                </div>
                            </li>
                            <li>
                                <span className="benefit-icon"><Tag size={22} /></span>
                                <div>
                                    <strong>Comparaciones fáciles</strong>
                                    <small>entre productos</small>
                                </div>
                            </li>
                            <li>
                                <span className="benefit-icon"><ShieldCheck size={22} /></span>
                                <div>
                                    <strong>Ofertas y promociones</strong>
                                    <small>de tiendas confiables</small>
                                </div>
                            </li>
                        </ul>
                    </aside>

                    {/* ---------- Tarjeta (formulario o éxito) ---------- */}
                    {registered ? (
                        <section className="register-card register-success">
                            <Brand />

                            <div className="success-icon">
                                <Check size={44} strokeWidth={2.5} />
                            </div>

                            <h2>
                                ¡Cuenta creada
                                <span className="gradient-text"> con éxito!</span>
                            </h2>

                            <p>
                                Tu cuenta ha sido registrada correctamente.
                                Ahora puedes iniciar sesión y disfrutar de
                                todas las funciones de SetupWise.
                            </p>

                            <Link to="/" className="register-submit success-button">
                                Ir a iniciar sesión
                                <ArrowRight size={18} />
                            </Link>

                            <footer className="success-footer">
                                <img src="/images/logo-setupwise.png" alt="" />
                                <div>
                                    <strong>SetupWise</strong>
                                    <small>Tu setup gamer, sin gastar de más</small>
                                </div>
                            </footer>
                        </section>
                    ) : (
                        <section className="register-card">
                            <h2>Registro</h2>
                            <p className="register-card-subtitle">
                                Ingresa tus datos para crear una nueva cuenta.
                            </p>

                            <form onSubmit={handleSubmit} noValidate={false}>
                                {/* Nombre */}
                                <div className="register-field">
                                    <span className="field-icon"><User size={20} /></span>
                                    <div className="field-body">
                                        <label htmlFor="fullName">Nombre completo *</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            placeholder="Ej. Juan Pérez"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            autoComplete="name"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Correo */}
                                <div className="register-field">
                                    <span className="field-icon"><Mail size={20} /></span>
                                    <div className="field-body">
                                        <label htmlFor="email">Correo electrónico *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="tu@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Contraseña */}
                                <div className="register-field">
                                    <span className="field-icon"><Lock size={20} /></span>
                                    <div className="field-body">
                                        <label htmlFor="password">Contraseña *</label>
                                        <div className="field-input-wrap">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                placeholder="Mínimo 8 caracteres"
                                                value={formData.password}
                                                onChange={handleChange}
                                                autoComplete="new-password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="toggle-password"
                                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Confirmar contraseña */}
                                <div className="register-field">
                                    <span className="field-icon"><Lock size={20} /></span>
                                    <div className="field-body">
                                        <label htmlFor="confirmPassword">Confirmar contraseña *</label>
                                        <div className="field-input-wrap">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                placeholder="Repite tu contraseña"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                autoComplete="new-password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="toggle-password"
                                                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Términos */}
                                <label className="register-terms">
                                    <input
                                        type="checkbox"
                                        checked={acceptedTerms}
                                        onChange={(e) => {
                                            setAcceptedTerms(e.target.checked);
                                            setError("");
                                        }}
                                    />
                                    <span className="terms-box">
                                        <Check size={14} strokeWidth={3} />
                                    </span>
                                    <span>
                                        Acepto los <a href="/terminos">Términos y Condiciones</a> y la{" "}
                                        <a href="/privacidad">Política de Privacidad</a>
                                    </span>
                                </label>

                                {error && <p className="register-error" role="alert">{error}</p>}

                                <button type="submit" className="register-submit">
                                    <User size={18} />
                                    Crear cuenta
                                </button>

                                <div className="register-divider"><span>o</span></div>

                                <button
                                    type="button"
                                    className="register-google"
                                    onClick={handleGoogle}
                                >
                                    <GoogleIcon />
                                    Continuar con Google
                                </button>
                            </form>
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
}

export default Register;