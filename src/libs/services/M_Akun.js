'use server'

import { cookies } from "next/headers"
import { cookie_set } from "../functions/cookie"
import { api_delete, api_get, api_post, api_put } from "../functions/web_service"
import { M_Riwayat_log } from "./M_Riwayat"

export const M_Akun_logout = async () => {
    if(cookies().has('userdata')) {
        cookies().delete('userdata')
    }
}

export const M_Akun_getAll = async () => {
    const response = await api_get('/v1/data/akun')

    return {
        success: response.success,
        data: response.data,
        message: response.message
    }
}

export const M_Akun_login = async (email_akun, password_akun, duration) => {
    const response = await api_post('/v1/userdata/create', {email_akun, password_akun})

    if(response.success) {
        cookies().set('userdata', response.data.data)
    }

    return {
        success: response.success,
        message: response.message,
        data: response.data
    }
}

export const M_Akun_create = async (payload) => {
    const response = await api_post('/v1/data/akun', payload)

    await M_Riwayat_log('Tambah', `Menambahkan ${Array.isArray(payload) ? payload.length : '1'} Data ke dalam Data Akun`, payload)

    return {
        success: response.success,
        message: response.message,
        data: response.data
    }
}

export const M_Akun_update = async (id_akun, payload) => {
    const response = await api_put('/v1/data/akun', {id_akun, payload})

    await M_Riwayat_log('Ubah', `Mengubah ${Array.isArray(id_akun) ? id_akun.length : '1'} Data dari Data Akun`, {id_akun, payload})

    return {
        success: response.success,
        message: response.message,
        data: response.data
    }
}

export const M_Akun_delete = async (id_akun) => {
    const response = await api_delete('/v1/data/akun', {id_akun})

    await M_Riwayat_log('Hapus', `Menghapus ${Array.isArray(id_akun) ? id_akun.length : '1'} Data dari Data Akun`, {id_akun})

    return {
        success: response.success,
        message: response.message,
        data: response.data
    }
}