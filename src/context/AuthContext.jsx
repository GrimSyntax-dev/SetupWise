import { createContext, useContext, useEffect, useState } from "react";

// Sesión y datos del usuario.
// Por ahora se guardan en el navegador (localStorage). Cuando exista el backend,
// signIn / signOut / updateUser se conectan a la API sin cambiar las pantallas.

const AuthContext = createContext(null);

const USER_KEY = "setupwise_user";
const SESSION_KEY = "setupwise_session";

function read(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? undefined : JSON.parse(raw);
    } catch {
        return undefined;
    }
}

function write(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* sin almacenamiento disponible */
    }
}

// Usuario de ejemplo para la primera vez que se abre la app
const createDemoUser = () => ({
    fullName: "Esau",
    email: "esau@ejemplo.com",
    phone: "",
    city: "",
    memberSince: new Date().toISOString()
});

const createBlankUser = () => ({
    fullName: "Nuevo usuario",
    email: "",
    phone: "",
    city: "",
    memberSince: new Date().toISOString()
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = read(USER_KEY);
        return stored === undefined ? createDemoUser() : stored;
    });

    // Sin sesión por defecto: cualquiera puede entrar al catálogo como visitante
    const [isLoggedIn, setIsLoggedIn] = useState(() => read(SESSION_KEY) ?? false);

    useEffect(() => write(USER_KEY, user), [user]);
    useEffect(() => write(SESSION_KEY, isLoggedIn), [isLoggedIn]);

    // Inicia sesión. Si no hay cuenta guardada en este dispositivo, crea una vacía.
    const signIn = (profile = {}) => {
        setUser((prev) => prev ?? { ...createBlankUser(), ...profile });
        setIsLoggedIn(true);
    };

    // Cierra sesión. Con forget = true también olvida la cuenta guardada (cambiar de cuenta).
    const signOut = ({ forget = false } = {}) => {
        setIsLoggedIn(false);
        if (forget) setUser(null);
    };

    const updateUser = (changes) => {
        setUser((prev) => ({ ...(prev ?? createBlankUser()), ...changes }));
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, signIn, signOut, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }

    return context;
}