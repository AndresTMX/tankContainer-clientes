import { useState, useContext, createContext, } from "react";
//libraries
import dayjs from "dayjs";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { useRealtime } from "../../hooks/FetchData";
//services
import { getOrdersWhereCustomerId, createNewOrder, deleteOrderWhereId, updateOrderWhereId } from "../../services/ordenes";
//context
import { useAuthContext } from "../auth";
import { getAllDestiny } from "../../services/destinos";

const ProgramacionContext = createContext();

export function ProgramacionProvider({ children }) {

    const { context } = useAuthContext();

    const { logOut, session } = context || {};

    const { user } = session || {};

    const { user_metadata } = user || {};

    const { email, first_name, last_name, cliente_id } = user_metadata || {};

    async function getOrders() {
        const { error, data } = await getOrdersWhereCustomerId(cliente_id)
        return { error, data }
    }

    async function getDestiny() {
        const { error, data } = await getAllDestiny(cliente_id);
        return { error, data }
    }

    const { loading: loadingOrders, error: errorOrders, data: ordenes } = useRealtime(getOrders, 'ordenes_lavado', 'ordenes_lavado');
    const { loading: loadingDestinos, error: errorDestinos, data: destinos } = useRealtime(getDestiny, 'destinos_cliente', 'destinos');

    const currentDate = dayjs();

    const orderDefault = {
        id: uuidv4(),
        destino_id: '',
        fecha_entrega: currentDate,
        tanques: [{ id: uuidv4(), tipo: 'AGMU', especificacion: 'NFC', editing: false }],
        cliente_id: cliente_id,
        status: 'por confirmar',
    };

    const [orderStore, setOrderStore] = useState([])

    const [order, setOrder] = useState(orderDefault);

    async function saveOrder(destino, fecha_entrega) {
        try {

            if (destino === '') {
                throw new Error(`selecciona el destino`)
            }

            const existInOrder = ordenes.find((o) => o.id === order.id);

            if (existInOrder === undefined) {
                //guardar nueva orden

                // let index = copyOrderStore.length;
                // copyOrderStore[index] = { ...order, destino_id: destino, fecha_entrega: fecha_entrega };
                // setOrderStore(copyOrderStore);
                // setOrder(orderDefault);
                // toast.success('orden guardada')

                // console.log({ ...order, destino_id: destino, fecha_entrega: fecha_entrega })

                const { error } = await createNewOrder({ ...order, destino_id: destino, fecha_entrega: fecha_entrega })

                if (error) {
                    throw new Error(error)
                } else {
                    toast.success('nueva orden creada')
                    setOrder(orderDefault);
                }


            } else {
                //actualizar orden anterior

                // let indexStored = copyOrderStore.findIndex((or) => or.id === order.id)
                // copyOrderStore[indexStored] = { ...order, destino: destino, fecha_entrega: fecha_entrega };
                // setOrderStore(copyOrderStore);
                // setOrder(orderDefault);

                const { error } = await updateOrderWhereId(order.id, { ...order, destino_id: destino, fecha_entrega: fecha_entrega })

                if (error) {
                    throw new Error(error)
                } else {
                    toast.success('orden actualizada')
                    setOrder(orderDefault);
                }


            }


        } catch (error) {
            toast.error(error?.message)
        }
    }

    function selectOrder(orderStored) {
        try {

            if (orderStored.id === order.id) {
                setOrder(orderDefault)

            } else {
                setOrder({ ...orderStored, fecha_entrega: dayjs(orderStored.fecha_entrega) })
            }


        } catch (error) {
            toast.error(error?.message)
        }
    }

    async function deleteOrder(orderId) {
        try {
            const { error } = deleteOrderWhereId(orderId);

            if (error) {
                throw new Error(error)
            }

        } catch (error) {
            toast.error(error?.message)
        }
    }

    function newItemOrder() {
        try {
            const newItem = { id: uuidv4(), tipo: 'AGMU', especificacion: 'NFC', editing: false }
            let copyOrder = { ...order }
            copyOrder.tanques.push(newItem);
            setOrder(copyOrder)
        } catch (error) {
            toast.error(error?.message)
        }
    }

    function changueModeEdit(itemId) {
        try {
            const copyOrder = { ...order };
            const indexItem = copyOrder.tanques.findIndex((tanque) => tanque.id === itemId);

            copyOrder.tanques[indexItem].editing = !copyOrder.tanques[indexItem].editing;

            setOrder(copyOrder)
        } catch (error) {
            toast.error(error?.message)
        }
    }

    function updateItemOrder(itemId, newTipo, newEspect) {
        try {

            const copyOrder = { ...order };
            const indexItem = copyOrder.tanques.findIndex((tanque) => tanque.id === itemId);

            copyOrder.tanques[indexItem].tipo = newTipo;
            copyOrder.tanques[indexItem].especificacion = newEspect;
            copyOrder.tanques[indexItem].editing = false;

            setOrder(copyOrder)
        } catch (error) {
            toast.error(error?.message)
        }
    }

    function deleteItemOrder(idItem) {
        try {
            const orderCopy = { ...order };
            const indexItem = orderCopy.tanques.findIndex((item) => item.id === idItem);
            orderCopy.tanques.splice(indexItem, 1);
            setOrder(orderCopy)
        } catch (error) {
            toast.error(error?.message)
        }
    }

    return (
        <ProgramacionContext.Provider
            value={{
                order,
                orderStore,
                ordenes,
                newItemOrder,
                changueModeEdit,
                deleteItemOrder,
                updateItemOrder,
                saveOrder,
                selectOrder,
                deleteOrder,
                destinos,
            }}>
            {children}
        </ProgramacionContext.Provider>
    )
}

export function useProgramacionContext() {
    const context = useContext(ProgramacionContext);
    return context;
}