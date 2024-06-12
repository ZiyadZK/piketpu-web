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
    const response = await api_post('/v1/data/riwayat', {
        tanggal: `${date_getYear()}-${date_getMonth()}-${date_getDay()}`,
        waktu: `${date_getTime('hour')}:${date_getTime('minutes')}`,
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