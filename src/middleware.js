import { decryptKey } from "@/libs/functions/encryptor"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const rolePath = {
    '/akun': ['Admin'],
    '/surat': ['Admin', 'Piket'],
    '/riwayat': ['Admin']
}

export async function middleware(req) {
    const pathname = req.nextUrl.pathname
    if(!cookies().has('userdata')) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    const decryptResponse = await decryptKey(cookies().get('userdata').value)
    if(!decryptResponse.success) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if(pathname !== '/') {
        for(let path of Object.keys(rolePath)) {
            if(pathname.startsWith(path)) {
                if(!rolePath[path].includes(decryptResponse.data.role_akun)) {
                    return NextResponse.redirect(new URL('/', req.url))
                }
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/akun', '/surat', '/']
}