import { decryptKey } from "@/libs/functions/encryptor"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function middleware(req) {
    // if(!cookies().has('userdata')) {
    //     return NextResponse.redirect(new URL('/login', req.url))
    // }

    // const decryptResponse = await decryptKey(cookies().get('userdata').value)
    // if(!decryptResponse.success) {
    //     cookies().delete('userdata')
    //     return NextResponse.redirect(new URL('/login', req.url))
    // }

    return NextResponse.next()
}

export const config = {
    matcher: ['/data/:path*', '/']
}