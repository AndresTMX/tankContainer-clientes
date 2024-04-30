import { Button, Card, Input, Select, SelectItem, Snippet, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
//icons
import { IoIosAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa6";
import { MdTune } from "react-icons/md";

//libraries
import dayjs from "dayjs";
import { date, time } from "../../hepers/datetime";
// import { v4 as uuidv4 } from 'uuid';
import { toast, Toaster } from "sonner";
//hooks
import { useProgramacionContext } from "../../context/programacion";

export function ProgramacionPage() {

    const { order, newItemOrder, orderStore, saveOrder, destinos, ordenes, handleStatus, handleOrder, status: statusFilter, assending, keyStatus } = useProgramacionContext();

    const { id, tanques, destino_id, fecha_entrega, status } = order || {};

    const destinoRef = useRef();

    const [dateTime, setDateTime] = useState({ fecha: fecha_entrega.format('YYYY-MM-DD'), hora: fecha_entrega.format('HH:mm') });

    useEffect(() => {
        setDateTime({ fecha: fecha_entrega.format('YYYY-MM-DD'), hora: fecha_entrega.format('HH:mm') });
    }, [order]);

    function saveData() {
        try {
            const destinoStored = destinoRef.current.value;
            const fechaEntrega = dayjs(`${dateTime.fecha}T${dateTime.hora}`);

            saveOrder(destinoStored, fechaEntrega)

        } catch (error) {
            toast.error(error?.message)
        }
    }

    return (
        <>
            <Toaster richColors position="top-center" />
            <main className="flex flex-col p-2 bg-gray-100 lg:py-5 lg:px-5 h-auto lg:h-[calc(100vh-65px)]">
                <section className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-9 grid-rows-auto gap-5">

                    <Card className="col-span-1 lg:col-span-6 bg-white border-1 border-zinc-200 h-[85svh]">
                        <div className="flex flex-col lg:justify-between lg:flex-row lg:items-center p-2 gap-2">

                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 w-full">
                                <Select
                                    className="lg:max-w-[300px]"
                                    size="sm"
                                    label='destino'
                                    ref={destinoRef}
                                    defaultSelectedKeys={[destino_id]}
                                >
                                    {destinos.map((ds) => (
                                        <SelectItem key={ds.id} value={ds.id}>{ds.destino}</SelectItem>
                                    ))}

                                </Select>

                                <Input
                                    className="lg:max-w-[250px]"
                                    label="fecha de entrega"
                                    type="date"
                                    size="sm"
                                    value={dateTime.fecha}
                                    onChange={(e) => setDateTime({ ...dateTime, fecha: e.target.value })}
                                />

                                <Input
                                    className="lg:max-w-[250px]"
                                    label="horario de entrega"
                                    type="time"
                                    size="sm"
                                    value={dateTime.hora}
                                    onChange={(e) => setDateTime({ ...dateTime, hora: e.target.value })}
                                />

                            </div>

                            <Button
                                size="md"
                                color="primary"
                                className="text-white"
                                onPress={saveData}
                            >
                                guardar orden
                            </Button>
                        </div>

                        <div className="flex flex-col px-2 gap-1">

                            <div className="flex flex-row items-center justify-end p-2">
                                <Button
                                    isDisabled={status != 'por confirmar'}
                                    isIconOnly
                                    size="sm"
                                    className="bg-primary text-2xl text-white"
                                    onPress={newItemOrder}
                                >
                                    <IoIosAdd />
                                </Button>
                            </div>

                            <div className="overflow-auto max-h-[300px] lg:max-h-[700px] lg:pb-10">
                                <div className="flex flex-col gap-3 p-4">
                                    {order.tanques.map((item) => (
                                        <ItemOrder key={item.id} item={item} />
                                    ))}
                                </div>
                            </div>
                        </div>

                    </Card>

                    <Card className="col-span-1 lg:col-span-3 bg-white h-[85svh] border-1 border-zinc-200">

                        <section className="flex flex-col gap-4 p-2">

                            <div className="flex flex-row items-center justify-around gap-1">
                                <span className="px-5 text-sm font-semibold text-gray-700">ordenes programadas</span>

                                <div className="flex flex-row items-center gap-1" >

                                    <div className="flex flex-row items-center">
                                        <Dropdown >
                                            <DropdownTrigger>
                                                <Button
                                                    isIconOnlu
                                                    size="sm"
                                                    color="transparent"
                                                    className="text-primary text-lg"
                                                >
                                                    <FaFilter />
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu
                                                selectionMode="single"
                                                aria-label="Static Actions"
                                                onAction={(key) => handleStatus(key)}
                                            >
                                                <DropdownItem key="confirmadas">confirmadas</DropdownItem>
                                                <DropdownItem key="por confirmar">por confirmar</DropdownItem>
                                                <DropdownItem key="todas">todos</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                        <span className="text-xs" >{keyStatus}</span>
                                    </div>

                                    <div className="flex flex-row items-center">
                                        <Dropdown >
                                            <DropdownTrigger>
                                                <Button
                                                    isIconOnlu
                                                    size="sm"
                                                    color="transparent"
                                                    className="text-primary text-lg"
                                                >
                                                    <MdTune />
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu
                                                selectionMode="single"
                                                aria-label="Static Actions"
                                                onAction={(key) => handleOrder()}
                                            >
                                                <DropdownItem key="ascendente">Ascendente</DropdownItem>
                                                <DropdownItem key="descendente">Descendente</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                        <span className="text-xs" >{assending ? 'ascendente' : 'descendente'}</span>
                                    </div>

                                </div>

                            </div>

                            <div className="overflow-auto pb-10 max-h-[80vh] lg:max-h-[calc(100vh-200px)]">
                                <div className="flex flex-col gap-3 p-3">
                                    {ordenes.map((order) => (
                                        <Store key={order.id} order={order} />
                                    ))}
                                </div>
                            </div>

                        </section>

                    </Card>

                </section>
            </main>
        </>
    )
}

function Store({ order }) {

    const { selectOrder, deleteOrder, order: orderSelect } = useProgramacionContext();

    const fechaDeOrden = date(order.fecha_entrega)

    const horaDeOrden = time(order.fecha_entrega)

    const idOrder = order.id;

    const routerColor = {
        'por confirmar': 'warning',
        'confirmada': 'success',
        'en proceso': 'primary',
        'completada': 'success'
    }

    return (
        <>
            <Card
                className={`flex flex-col gap-2 p-4 ${orderSelect.id === order.id ? 'bg-gray-100' : ''} `}>
                <Snippet size="sm" className="text-[12px] lg:text-sm">{order.id}</Snippet>

                <div className="flex flex-row items-center gap-2">
                    <FaRegCalendarCheck />
                    <p className="text-sm text-gray-500">Fecha programada</p>
                </div>
                <span className="p-1" >{fechaDeOrden}</span>

                <div className="flex flex-row items-center gap-2">
                    <IoTimeOutline />
                    <p className="text-sm text-gray-500">Horario programado</p>
                </div>
                <span className="p-1" >{horaDeOrden}</span>


                <p className="text-sm text-gray-500">Destino</p>
                <span>{order?.destinos?.destino}</span>

                <p className="text-sm text-gray-500">Cantidad de tanques</p>
                <span>{order.tanques.length}</span>

                <div className="flex flex-row items-center justify-between">

                    <Chip
                        size="sm"
                        color={routerColor[order.status]}
                        className="text-white"
                    >
                        {order.status}
                    </Chip>

                    <div className="flex flex-row items-center gap-2">
                        <Button
                            size="sm"
                            isIconOnly
                            color="transparent"
                            isDisabled={!order.status === 'por confirmar'}
                            className="text-xl text-primary"
                            onPress={() => selectOrder({
                                id: order.id,
                                destino_id: order.destino_id,
                                fecha_entrega: order.fecha_entrega,
                                tanques: order.tanques,
                                cliente_id: order.cliente_id,
                                status: order.status,
                            })}
                        >
                            <MdEdit />
                        </Button>
                        <Button
                            size="sm"
                            isIconOnly
                            color="transparent"
                            className="text-xl text-danger"
                            isDisabled={order.status != 'por confirmar'}
                            onPress={() => deleteOrder(idOrder)}
                        >
                            <FaTrash />
                        </Button>
                    </div>

                </div>
            </Card>
        </>
    )
}

function ItemOrder({ item }) {

    const { deleteItemOrder, updateItemOrder, changueModeEdit, discardItemOrder, order } = useProgramacionContext();

    const { status } = order || {};

    const especificacionRef = useRef();
    const tipoRef = useRef();

    const espectOptions = ['NFC', 'FCOJ', 'OR-OIL', 'DLIMONENE', 'TEQUILA', 'NFC/FCOJ'];
    const typeOptions = ['AGMU', 'DYOU', 'AFIU'];

    /*/
       0- eliminar el item de pedido de la interfaz del cliente => (funcion para cambiar key descaratdo de false a true en cliete, despues en servidor)
       1- volver a poner la orden de lavado en 'por confirmar' 
       2- notificar del tanque cancelado 
       3- poner el tanque que el cliente elimina resaltado en la interfaz => (condicional de si descartado es true mostrar boton de reasignacion)
       4- reasignar el lavado programado a otra orden || devolver el tanque a almacenaje
       5- confirmar nuevamente la orden  

    /*/

    function onDelete() {
        try {

            if (status === 'por confirmar') {
                deleteItemOrder(item.id)
            }

            if (status === 'confirmada') {
                toast.custom((t) => (
                    <Card className="flex flex-col gap-4 w-full justify-center items-center shadow-md bg-white p-4 rounded-md">

                        <p className="text-sm text-center" >
                            ¿eliminar este tanque de tu order confirmada?
                        </p>

                        <div className="flex flex-row gap-2 items-center">
                            <Button
                                size='sm'
                                onClick={() => toast.dismiss(t)}
                            >
                                cancelar
                            </Button>

                            <Button
                                onClick={async () => {

                                    await discardItemOrder(item.id, () => toast.dismiss(t))
                                    toast.warning('guarda tu orden para conservar los cambios')

                                }
                                }
                                size="sm"
                                color="danger">
                                eliminar
                            </Button>
                        </div>
                    </Card>
                ))
            }

        } catch (error) {

        }
    }


    return (
        <>
            <Card className={`${item.descartado ? 'hidden' : 'flex'}`}>

                <div className="flex flex-col lg:flex-row items-center gap-2 p-2">

                    <Select
                        size="sm"
                        label='tipo'
                        defaultSelectedKeys={[item.tipo]}
                        ref={tipoRef}
                        isDisabled={!item.editing}
                    >
                        {typeOptions.map((op) => (
                            <SelectItem key={op} value={op}>{op}</SelectItem>
                        ))}
                    </Select>

                    <Select
                        size="sm"
                        label='especificacion'
                        defaultSelectedKeys={[item.especificacion]}
                        ref={especificacionRef}
                        isDisabled={!item.editing}
                    >
                        {espectOptions.map((es) => (
                            <SelectItem key={es} value={es}>{es}</SelectItem>
                        ))}
                    </Select>

                    <div className="flex flex-row items-center justify-end w-full gap-2">
                        <Button
                            size="sm"
                            isIconOnly
                            color="transparent"
                            isDisabled={status != 'por confirmar'}
                            className={`text-xl 'text-primary'}`}
                            onPress={() => changueModeEdit(item.id)}
                        >
                            <MdEdit />
                        </Button>

                        <Button
                            size="sm"
                            isIconOnly
                            color="transparent"
                            isDisabled={status != 'por confirmar'}
                            className={`text-xl ${item.editing ? 'text-primary' : 'text-default'}`}
                            onPress={() => updateItemOrder(item.id, tipoRef.current.value, especificacionRef.current.value)}
                        >
                            <FaSave />
                        </Button>

                        <Button

                            size="sm"
                            isIconOnly
                            color="transparent"
                            className={`text-xl text-danger`}
                            onPress={onDelete}
                        >
                            <FaTrash />
                        </Button>
                    </div>



                </div>

            </Card>
        </>
    )
}