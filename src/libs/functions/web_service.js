'use server'

import axios from "axios"

export const urlGet = async (url) => {
    try {
        const response = await axios.get(`${process.env.API_URL}${url}`, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
}

export const urlPost = async (url, payload) => {
    try {
        const response = await axios.post(`${process.env.API_URL}${url}`, payload, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
}

export const urlPut = async (url, payload) => {
    try {
        const response = await axios.put(`${process.env.API_URL}${url}`, payload, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
}

export const urlDelete = async (url, payload) => {
    try {
        const response = await axios({
            method: 'DELETE',
            url: `${process.env.API_URL}${url}`,
            data: payload,
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
}

export const mainUrlGet = async (url) => {
    try {
        const response = await axios.get(`${process.env.API_MAIN_URL}${url}`, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        })

        return response.data
        
    } catch (error) {
        console.log(error)
        return error.response.data
    }
}