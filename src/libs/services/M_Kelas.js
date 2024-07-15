'use server'

import { main_api_get } from "../functions/web_service"

export const M_Kelas_get = async (kelas, jurusan, rombel) => {
    const response = await main_api_get(`simak/v1/data/kelas/${kelas}/${jurusan}/${rombel}`)

    return {
        success: response.success,
        message: response.message,
        data: response.data
    }
}

export const M_Kelas_getAll = async () => {
    const response = await main_api_get(`simak/v1/data/kelas`)

    return {
        success: response.success,
        message: response.message,
        data: response.data
    }
}