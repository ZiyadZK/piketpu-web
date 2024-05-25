'use server'

import { cookies } from "next/headers"

export const logoutAkun = async () => {
    if(cookies().has('userdata')) {
        cookies().delete('userdata')
    }
}