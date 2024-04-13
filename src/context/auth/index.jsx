import supabase from "../../supabase";
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const navigate = useNavigate();

    async function login(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { error }
            }

            if (data) {
                sessionStorage.setItem('tankManager-session', JSON.stringify(data));
                navigate('/');
            }

        } catch (error) {
            console.error(error)
        }
    }

    async function logOut() {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                throw new Error(`Error al cerrar sesion: ${error.message}`)
            }

            navigate('/login')
            sessionStorage.clear()
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : 'Error desconocido');
        }
    }

    const session = JSON.parse(sessionStorage.getItem('tankManager-session') || '[]')

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session == null) {
                    navigate('/login', { replace: true });
                } else {
                    sessionStorage.setItem('tankManager-session', JSON.stringify(session));
                    children
                }
            }
        );

        return () => {
            data?.subscription?.unsubscribe(); // Desuscribirse del cambio de estado de autenticación al desmontar el componente
        };
    }, [children, navigate]);

    return (
        <>
            <AuthContext.Provider value={{ login, logOut, session }}>
                {children}
            </AuthContext.Provider>
        </>
    )
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    return { context }
}