import supabase from "../../supabase";
import { createNotification } from "../notificaciones";

export async function getOrdersWhereCustomerId(customerId, status, ascending) {
    try {

        const { error, data } = await supabase
            .from('ordenes_lavado')
            .select('*, destinos(*)')
            .order('fecha_entrega', { ascending: ascending })
            .eq('cliente_id', customerId)
            .in('status', status)
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

        const { error: errorCreate } = await supabase
            .from('ordenes_lavado')
            .insert({ ...order })

        if (errorCreate) {
            throw new Error(`Error al crear nueva order, error: ${errorCreate.message}`)
        }

        const notificacion = {
            titulo: 'nueva orden',
            descripcion: 'añadio una orden de lavado',
            orden_id: order.id,
            cliente_id: order.cliente_id
        }

        const { error: errorNotification } = await createNotification(notificacion);

        if (errorNotification) {
            throw new Error(`Error al crear notificacion , error: ${errorNotification.message}`)
        }

        let error = errorCreate || errorNotification;

        return { error }
    } catch (error) {
        console.error(error)
    }
}

export async function updateOrderWhereId(orderId, updates) {
    try {
        const { error: errorUpdateOrder } = await supabase
            .from('ordenes_lavado')
            .update({ ...updates })
            .eq('id', orderId)

        if (errorUpdateOrder) {
            throw new Error(`Error al crear nueva order, error: ${errorUpdateOrder.message}`)
        }

        const { errorUpdateWashing } = await supabase
            .from('lavados')
            .update({ fecha_entrega: updates.fecha_entrega, fecha_recoleccion: updates.fecha_recoleccion })
            .eq('orden_id', orderId)

        if (errorUpdateWashing) {
            throw new Error(`Error al actualizar el horario de lavado, error: ${errorUpdateWashing.message}`)
        }

        const notificacion = {
            titulo: 'actualizacion de orden',
            descripcion: 'actualizo la orden',
            orden_id: orderId,
            cliente_id: updates.cliente_id
        }

        const { error: errorNotification } = await createNotification(notificacion);

        if (errorNotification) {
            throw new Error(`Error al crear notificacion , error: ${errorNotification.message}`)
        }

        let error = errorUpdateOrder || errorUpdateWashing || errorNotification;

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