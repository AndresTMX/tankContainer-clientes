import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/es';
dayjs.locale('es');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

export const dateInText = (date) => dayjs(date).format('dddd, MMMM D, YYYY');

export const date = (date) => dayjs(date).format('dddd D MMMM YYYY')

export const time = (date) => dayjs(date).tz('America/Mexico_City').format('h:mm A');

export const dateInTextEn = (date) => dayjs(date).locale('en').format('dddd, MMMM D, YYYY');

export const currentDate = new dayjs(new Date()).utc();

export const transformDate = (date) => dayjs(date);

export const dateMX = (date) => transformDate(date).tz('America/Mexico_City');

export const dateMXFormat = (date) => {
    const datemx = new dayjs(date).tz('America/Mexico_City');
    const year = datemx.$y;
    const month = datemx.$M;
    const day = datemx.$D;
    return `${day}/${month}/${year}`
}

export const datetimeMXFormat = (date) => {
    const datemx = transformDate(date).tz('America/Mexico_City').format('h:mm A');
    return datemx
}

export const currenDateFormatTz = dateMX(currentDate);

export const tiempoTranscurrido = (date) => dayjs(date).tz('America/Mexico_City').fromNow(true)

export const timepoParaX = (date) => {

    const fechaActualInString = dayjs(currentDate).toISOString();
    const fechaRecibida = dayjs(date).toISOString();

    return dayjs(fechaRecibida).from(fechaActualInString, true)
}

export const dateTextShort = (date) => {
    const splitText = dateInText(date)?.split(',', [4])
    const splitData = splitText[1].split(' ', 3)
    const dia = splitText[0]
    return `${dia} ${splitData[2]} de ${splitData[1]}`
}

export const dateExpiration = (date) => {
    const datemx = dayjs(date).tz('America/Mexico_City')
    const year = datemx.$y;
    const month = datemx.$M;
    const day = datemx.$D + 3;
    return `${day}/${month}/${year}`
}

export const dateTimeMoreMinutes = (date, minutes) => {
    // Parsea la fecha dada
    const fecha = dayjs(date).tz('America/Mexico_City');

    // Suma los minutos especificados
    const fechaModificada = fecha.add(minutes, 'minute');

    // Formatea la fecha modificada y devuelve la hora en formato HH:mm
    return fechaModificada.format('hh:mm A');

}

export const minutosXhoras = (horas, minutos) => dayjs().set('hour', horas).set('minute', minutos).format('HH:mm');

export const diferenciaEnHoras = (hora) => {
    const diferencia = dayjs(hora).diff(dayjs(), 'minute')

    const horasRestantes = Math.floor(diferencia / 60)
    const minutosRestantes = diferencia % 60

    return (`${horasRestantes} horas y ${minutosRestantes} minutos restantes`);
}