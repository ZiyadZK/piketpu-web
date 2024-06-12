'use server'

import { api_delete, api_get, api_post, api_put } from "../functions/web_service"
import { M_Riwayat_log } from "./M_Riwayat"

export const M_Surat_getAll = async () => {
    const response = await api_get('/v1/data/surat')

    return {
        success: response.success,
        message: response.message,
        data: response.data
    }
}

export const M_Surat_create = async (payload) => {
    const response = await api_post('/v1/data/surat', payload)

    await M_Riwayat_log('Tambah', `Menambahkan ${Array.isArray(payload) ? payload.length : '1'} Data ke dalam Data Surat`, payload)

    return {
        success: response.success,
        message: response.message,
        data: response.data
    }
}

export const M_Surat_update = async (id_surat_izin, payload) => {
    const response = await api_put('/v1/data/surat', {id_surat_izin, payload})

    await M_Riwayat_log('Ubah', `Mengubah ${Array.isArray(id_surat_izin) ? id_surat_izin.length : '1'} Data dari Data Surat`, {id_surat_izin, payload})

    return {
        success: response.success,
        message: response.message,
        data: response.data
    }
}

export const M_Surat_delete = async (id_surat_izin) => {
    const response = await api_delete('/v1/data/surat', {id_surat_izin})

    await M_Riwayat_log('Hapus', `Menghapus ${Array.isArray(id_surat_izin) ? id_surat_izin.length : '1'} Data dari Data Surat`, {id_surat_izin})

    return {
        success: response.success,
        message: response.message,
        data: response.data
    }
}