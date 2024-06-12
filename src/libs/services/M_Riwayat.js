'use server'

import { date_getDay, date_getMonth, date_getTime, date_getYear } from "../functions/date"
import { getLoggedUserdata } from "../functions/userdata"
import { api_delete, api_get, api_post } from "../functions/web_service"

export const M_Riwayat_getAll = async () => {
    const response = await api_get('/v1/data/riwayat')

    return {
        success: response.success,
        message: response.message,
        data: response.data
    }
}

export const M_Riwayat_log = async (aksi, keterangan, payload) => {
    const responseUserdata = await getLoggedUserdata()

    const now = new Date();

    // Step 2: Format the date and time for Asia/Jakarta timezone
    const options = {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(now);

    // Step 3: Extract parts and construct the desired format
    let year, month, day, hour, minute;

    parts.forEach(({ type, value }) => {
        switch (type) {
            case 'year':
            year = value;
            break;
            case 'month':
            month = value;
            break;
            case 'day':
            day = value;
            break;
            case 'hour':
            hour = value;
            break;
            case 'minute':
            minute = value;
            break;
        }
    });

    const response = await api_post('/v1/data/riwayat', {
        tanggal: `${year}-${month}-${day}`,
        waktu: `${hour}:${minute}`,
        nama_akun: responseUserdata.data.nama_akun,
        aksi, keterangan,
        json: JSON.stringify(payload)
    })

    return {
        success: response.success,
        message: response.message,
        data: response.data
    }
}

export const M_Riwayat_delete = async (no_surat) => {
    const response = await api_delete('/v1/data/riwayat', {no_surat})

    return {
        success: response.success,
        message: response.message,
        data: response.data
    }
}