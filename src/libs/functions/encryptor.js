'use server'

const CryptoJS = require('crypto-js')

export const decryptKey = async (token) => {
    try {
        const bytes = CryptoJS.AES.decrypt(token, process.env.PUBLIC_KEY)
        const payload = bytes.toString(CryptoJS.enc.Utf8)

        return {
            success: true,
            data: JSON.parse(payload)
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message
        }
    }
}

export const encryptKey = async (payload) => {
    try {
        const data = typeof(payload) === 'object' ? JSON.stringify(payload) : String(payload)
        const token = CryptoJS.AES.encrypt(data, process.env.PUBLIC_KEY)

        return {
            success: true,
            data: token
        }
    } catch (error) {
        console.log(error)

        return {
            success: false,
            message: error.message
        }
    }
}