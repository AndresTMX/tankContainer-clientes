import supabase from "../../supabase";
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const navigate = useNavigate();

    const [session, setSession] = useState(null)

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

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session == null) {
                navigate('/login', { replace: true });
            } else {
                children
            }
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => {
            subscription.unsubscribe()
        }
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