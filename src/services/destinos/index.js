import supabase from "../../supabase";

export async function getAllDestiny(cliente_id) {
    try {
        const { error, data } = await supabase
            .from('destinos')
            .select('*')
            .eq('cliente_id', cliente_id)

        if (error) {
            throw new Error(`Error al obtener destinos, error: ${error.message}`)
        }

        return { error, data }
    } catch (error) {
        console.error(error)
    }
}