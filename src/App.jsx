import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./view/Login";
import Register from "./view/Register";
import Home from "./view/Home";
import Catalog from "./view/Catalog";

// Pantalla temporal para las secciones que aún no están construidas.
function ComingSoon({ title }) {
    return (
        <main style={{ padding: "40px 32px", color: "#f8fafc", fontFamily: "Inter, sans-serif" }}>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", marginBottom: 8 }}>{title}</h1>
            <p style={{ color: "#aab4c8" }}>Esta sección estará disponible pronto.</p>
        </main>
    );
}

function App() {
    return (
        <Routes>
            {/* Autenticación: pantallas compactas, sin sidebar */}
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Register />} />

            {/* Vista de usuario: con sidebar y barra superior */}
            <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/catalogo" element={<Catalog />} />
                <Route path="/comparar" element={<ComingSoon title="Comparar" />} />
                <Route path="/crear-setup" element={<ComingSoon title="Crear Setup" />} />
                <Route path="/cuenta" element={<ComingSoon title="Mi cuenta" />} />
            </Route>

            {/* Cualquier otra ruta vuelve al inicio de sesión */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;