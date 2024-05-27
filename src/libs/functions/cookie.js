import { cookies } from "next/headers"

export const cookie_get = (key) => {
    try {
        if(!cookies().has(key)) {
            return null
        }

        return cookies().get(key).value
    } catch (error) {
        console.log(error)
        return null
    }
}

export const cookie_set = (key, value, duration) => {
    cookies().set(key, value, {
        expires: duration
    })
}