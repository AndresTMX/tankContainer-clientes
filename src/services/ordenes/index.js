import supabase from "../../supabase";

export async function getOrdersWhereCustomerId(customerId) {
    try {

        const { error, data } = await supabase
            .from('ordenes_lavado')
            .select('*, destinos(*)')
            .order('fecha_entrega', { ascending: true })
            .eq('cliente_id', customerId)
            .limit(20)

        if (error) {
            throw new Error(`Error al recuperar ordenes de lavado, error: ${error.message}`)
        }

        return { error, data }
    } catch (error) {
        console.error(error)
    }
}

export async function createNewOrder(order) {
    try {
        const { error } = await supabase
            .from('ordenes_lavado')
            .insert({ ...order })

        if (error) {
            throw new Error(`Error al crear nueva order, error: ${error.message}`)
        }

        return { error }
    } catch (error) {
        console.error(error)
    }
}

export async function updateOrderWhereId(orderId, updates) {
    try {
        const { error } = await supabase
            .from('ordenes_lavado')
            .update({ ...updates })
            .eq('id', orderId)

        if (error) {
            throw new Error(`Error al crear nueva order, error: ${error.message}`)
        }

        return { error }
    } catch (error) {
        console.error(error)
    }
}

export async function deleteOrderWhereId(orderId) {
    try {
        const { error } = await supabase
            .from('ordenes_lavado')
            .delete()
            .eq('id', orderId)

        if (error) {
            throw new Error(`Error al eliminar orden, error: ${error.message}`)
        }

        return { error }
    } catch (error) {
        console.error(error)
    }
}