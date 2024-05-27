'use server'

import { cookies } from "next/headers"
import { decryptKey } from "./encryptor"
import { cookie_get } from "./cookie"

export const getLoggedUserdata = async () => {
    const token = cookie_get('userdata')
    return await decryptKey(token)
}