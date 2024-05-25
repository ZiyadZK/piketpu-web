'use server'

import { cookies } from "next/headers"
import { decryptKey } from "./encryptor"

export const getLoggedUserdata = async () => {
    const token = cookies().get('userdata').value
    return await decryptKey(token)
}