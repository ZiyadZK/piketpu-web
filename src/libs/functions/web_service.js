'use server'

import axios from "axios"

export const api_get = async (url) => {
    try {
        const response = await axios.get(`${process.env.API_URL}${url}`, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        })

        return {
            success: true,
            data: response.data.data
        }
    } catch (error) {
        console.log(error.response.data)
        return {
            success: false,
            message: error.response.data.error
        }
    }
}

export const api_post = async (url, payload) => {
    try {
        const response = await axios.post(`${process.env.API_URL}${url}`, payload, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        })

        console.log(response.data)

        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        console.log(error.response.data)
        return {
            success: false,
            message: error.response.data.error
        }
    }
}

export const api_put = async (url, payload) => {
    try {
        await axios.put(`${process.env.API_URL}${url}`, payload, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        })

        return {
            success: true
        }
    } catch (error) {
        console.log(error.response.data)
        return {
            success: false,
            message: error.response.data.error
        }
    }
}

export const api_delete = async (url, payload) => {
    try {
        await axios({
            method: 'DELETE',
            url: `${process.env.API_URL}${url}`,
            data: payload,
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        })

        return {
            success: true
        }
    } catch (error) {
        console.log(error.response.data)
        return {
            success: false,
            message: error.response.data.error
        }
    }
}

export const main_api_get = async (url) => {
    try {
        const response = await axios.get(`${process.env.MAIN_API_URL}${url}`, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        })

        return {
            success: true,
            data: response.data.data
        }
    } catch (error) {
        console.log(error.response.data)
        return {
            success: false,
            message: error.response.data.error
        }
    }
}

export const main_api_post = async (url, payload) => {
    try {
        await axios.post(`${process.env.API_MAIN_URL}${url}`, payload, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        })

        return {
            success: true
        }
    } catch (error) {
        console.log(error.response.data)
        return {
            success: false,
            message: error.response.data.error
        }
    }
}