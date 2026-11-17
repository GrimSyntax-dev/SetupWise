import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
import Layout from "./components/Layout";
import Login from "./view/Login";
import Register from "./view/Register";
import Home from "./view/Home";
import Catalog from "./view/Catalog";
import Compare from "./view/Compare";
import Builder from "./view/Builder";
import Account from "./view/Account";

// Las pantallas que necesitan una cuenta mandan al login y luego regresan aquí.
function RequireAuth({ children }) {
    const { isLoggedIn, user } = useAuth();
    const location = useLocation();

    if (!isLoggedIn || !user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname + location.search }}
            />
        );
    }

    return children;
}

function App() {
    return (
        <AuthProvider>
            <StoreProvider>
                <Routes>
                    {/* Autenticación: pantallas compactas, sin sidebar */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Register />} />

                    {/* Tienda: abierta para todos, con sidebar y barra superior */}
                    <Route element={<Layout />}>
                        <Route index element={<Catalog />} />
                        <Route path="/inicio" element={<Home />} />
                        <Route path="/comparar" element={<Compare />} />
                        <Route path="/crear-setup" element={<Builder />} />

                        {/* Solo con sesión iniciada */}
                        <Route
                            path="/cuenta"
                            element={
                                <RequireAuth>
                                    <Account />
                                </RequireAuth>
                            }
                        />
                    </Route>

                    {/* Rutas anteriores y cualquier otra */}
                    <Route path="/catalogo" element={<Navigate to="/" replace />} />
                    <Route path="/home" element={<Navigate to="/inicio" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </StoreProvider>
        </AuthProvider>
    );
}

export default App;