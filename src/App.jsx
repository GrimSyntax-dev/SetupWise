import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { InventoryProvider } from "./context/InventoryContext";
import { StoreProvider } from "./context/StoreContext";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import Login from "./view/Login";
import Register from "./view/Register";
import Home from "./view/Home";
import Catalog from "./view/Catalog";
import Compare from "./view/Compare";
import Builder from "./view/Builder";
import Account from "./view/Account";
import AdminDashboard from "./view/admin/AdminDashboard";
import AdminInventory from "./view/admin/AdminInventory";
import AdminAds from "./view/admin/AdminAds";

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

// Solo para administradores. Un usuario normal vuelve a la tienda.
// OJO: esto solo oculta las pantallas. La seguridad real (quién puede cambiar el
// stock o los anuncios) debe validarse también en el backend.
function RequireAdmin({ children }) {
    const { isLoggedIn, isAdmin } = useAuth();
    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function App() {
    return (
        <AuthProvider>
            <InventoryProvider>
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

                        {/* Panel de administrador */}
                        <Route
                            path="/admin"
                            element={
                                <RequireAdmin>
                                    <AdminLayout />
                                </RequireAdmin>
                            }
                        >
                            <Route index element={<AdminDashboard />} />
                            <Route path="inventario" element={<AdminInventory />} />
                            <Route path="anuncios" element={<AdminAds />} />
                        </Route>

                        {/* Rutas anteriores y cualquier otra */}
                        <Route path="/catalogo" element={<Navigate to="/" replace />} />
                        <Route path="/home" element={<Navigate to="/inicio" replace />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </StoreProvider>
            </InventoryProvider>
        </AuthProvider>
    );
}

export default App;