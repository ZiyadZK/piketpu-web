'use server'

import { main_api_get } from "../functions/web_service"

export const M_Siswa_getAll = async () => {
    const response = await main_api_get('simak/v1/data/siswa')

    return {
        success: response.success,
        message: response.message,
        data: response.data
    }
}