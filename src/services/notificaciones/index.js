import supabase from "../../supabase";


export async function createNotification(notificacion) {
    try {
        const { error } = await supabase
            .from('notificaciones_ordenes')
            .insert({ ...notificacion })

        if (error) {
            throw new Error(`Error al crear notificacion , error: ${error.message}`)
        }

        return { error }
    } catch (error) {
        console.error(error)
    }
}

export async function getNotificationsWhitLimit(limit) {
    try {
        const { error } = await supabase
            .from('notificaciones_ordenes')
            .select('*, ordenes(clientes(cliente))')
            .order('created_at', { ascending: true })
            .limit(limit)

        if (error) {
            throw new Error(`Error al crear notificacion , error: ${error.message}`)
        }
    } catch (error) {
        console.error(error)
    }
}