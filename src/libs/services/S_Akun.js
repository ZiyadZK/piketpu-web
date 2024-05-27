'use server'

import { cookies } from "next/headers"
import { urlDelete, urlGet, urlPost, urlPut } from "../functions/web_service"
import { cookie_set } from "../functions/cookie"

export const logoutAkun = async () => {
    if(cookies().has('userdata')) {
        cookies().delete('userdata')
    }
}

export const S_Akun_login = async (email_akun, password_akun, duration) => {
    const response = await urlPost('/v1/userdata/create', {email_akun, password_akun})
    console.log(response)

    if(response.success) {
        cookie_set('userdata', response.data, duration)
    }

    return {
        success: response.success,
        message: response.result,
        data: response.data
    }
}

export const S_Akun_getAll = async () => {
    const response = await urlGet('/v1/data/akun')

    return {
        success: response.success,
        message: response.result,
        data: response.data
    }
}

export const S_Akun_create = async (payload) => {
    const response = await urlPost('/v1/data/akun', payload)

    return {
        success: response.success,
        message: response.result,
        data: response.data
    }
}

export const S_Akun_update = async (id_akun, payload) => {
    const response = await urlPut('/v1/data/akun', {id_akun, payload})

    return {
        success: response.success,
        message: response.result,
        data: response.data
    }
}

export const S_Akun_delete = async (id_akun) => {
    const response = await urlDelete('/v1/data/akun', {id_akun})

    return {
        success: response.success,
        message: response.result,
        data: response.data
    }
}