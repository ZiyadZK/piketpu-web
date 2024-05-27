'use server'

import axios from "axios"

export const urlGet = async (url) => {
    return new Promise(async (resolve, reject) => {
        await axios.get(`${process.env.API_URL}${url}`, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        }).then(response => {
            const responseData = response.data
            resolve({
                success: true,
                result: responseData,
                data: responseData.data
            })
        }).catch(error => {
            const responseData = error.response
            reject({
                success: false,
                result: responseData.data.error
            })
        })
    })
}

export const urlPost = async (url, payload) => {
    try {
        const response = await axios.post(`${process.env.API_URL}${url}`, payload, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        })

        console.log(response.data)

        return {
            success: true,
            result: response.data.success,
            data: response.data.data
        }
    } catch (error) {
        const response = error.response.data
        return {
            success: false,
            result: response.error
        }
    }
    
    // return new Promise(async (resolve, reject) => {
    //     await axios.post(`${process.env.API_URL}${url}`, payload, {
    //         headers: {
    //             'X-API-KEY': process.env.API_KEY
    //         }
    //     }).then(response => {
    //         const responseData = response.data
    //         resolve({
    //             success: true,
    //             result: responseData,
    //             data: responseData.data
    //         })
    //     }).catch(error => {
    //         const responseData = error.response.data
    //         reject({
    //             success: false,
    //             result: responseData.error
    //         })
    //     })
    // })
}

export const urlPut = async (url, payload) => {
    return new Promise(async (resolve, reject) => {
        await axios.put(`${process.env.API_URL}${url}`, payload, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        }).then(response => {
            const responseData = response.data
            resolve({
                success: true,
                result: responseData,
                data: responseData.data
            })
        }).catch(error => {
            const responseData = error.response
            reject({
                success: false,
                result: responseData.data.error
            })
        })
    })
}

export const urlDelete = async (url, payload) => {
    return new Promise(async (resolve, reject) => {
        await axios({
            method: 'DELETE',
            url: `${process.env.API_URL}${url}`,
            data: payload,
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        }).then(response => {
            const responseData = response.data
            resolve({
                success: true,
                result: responseData
            })
        }).catch(error => {
            const responseData = error.response
            reject({
                success: false,
                result: responseData.data.error
            })
        })
    })
}