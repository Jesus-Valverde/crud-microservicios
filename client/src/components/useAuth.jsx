import { useState } from "react";

export default function useAuth() {
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const saveToken = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        console.log("Token guardado: " + newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        console.log("Token removido");
    };

    // fetch con JWT
    const authFetch = async (url, options = {}) => {
        const headers = {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        };

        const res = await fetch(url, { ...options, headers });

        if (res.status === 401 || res.status === 403) {
            logout();
            throw new Error("Sesión expirada o no autorizada");
        }

        return res.json();
    };

    return { token, saveToken, logout, authFetch };
}
