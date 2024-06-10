'use server'

import { main_api_get } from "../functions/web_service"

export const M_Pegawai_getAll = async () => {

    const response = await main_api_get('simak/v1/data/pegawai')

    return {
        success: response.success,
        message: response.message,
        data: response.data
    }
}