import supabase from "../../supabase";
import { useState, useEffect } from "react";

function useFetchData(service, nameCache) {

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    function getCache(nameCache) {
        try {
            const storage = localStorage.getItem(nameCache);
            return JSON.parse(storage)
        } catch (error) {
            console.error(error)
            return null
        }
    }

    useEffect(() => {
        async function fetch() {
            setError(null)
            setLoading(true)
            try {
                const { error: errorRequest, data: dataRequest } = await service()

                if (errorRequest === undefined || errorRequest === null) {
                    setData(dataRequest)
                    localStorage.setItem(nameCache, JSON.stringify(dataRequest))
                } else {
                    setError(errorRequest)
                    setData(getCache(nameCache));
                }
            } catch (error) {
                console.error(error);
                setError(error);
                setData(getCache(nameCache));
            }
            setLoading(false)
        }

        fetch();
    }, [nameCache])

    return { data, error, loading, getCache }

}

function useRealtime(service, nameCache, nameTable, dependencies) {

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [update, setUpdate] = useState(false);

    const forceUpdate = () => setUpdate(!update)

    const renderDependencies = dependencies ? [update, ...dependencies] : [update];

    function getCache(nameCache) {
        try {
            const storage = localStorage.getItem(nameCache);
            return JSON.parse(storage)
        } catch (error) {
            console.error(error)
            return null
        }
    }

    const changes = supabase.channel(`custom-all-channel-${nameTable}`)
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: nameTable },
            (payload) => {
                setUpdate(!update)
            }
        )
        .subscribe()

    useEffect(() => {

        async function fetch() {
            setError(null)
            setLoading(true)
            try {
                const { error: errorRequest, data: dataRequest } = await service()

                if (errorRequest === undefined || errorRequest === null) {
                    setData(dataRequest)
                    if (nameCache) {
                        localStorage.setItem(nameCache, JSON.stringify(dataRequest))
                    }
                } else {
                    setError(errorRequest)
                    if (nameCache) {
                        setData(getCache(nameCache));
                    }
                }
            } catch (error) {
                console.error(error);
                setError(error);
                if (nameCache) {
                    setData(getCache(nameCache));
                }
            }
            setLoading(false)
        }

        fetch();
        return () => {
            // Limpiar suscripción cuando el componente se desmonta
            changes.unsubscribe();
        };

    }, renderDependencies);

    return { loading, error, data, forceUpdate }

}

export { useFetchData, useRealtime };