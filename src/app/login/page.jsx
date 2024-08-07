'use client'

import { swalToast } from "@/libs/functions/toast"
import { M_Akun_login } from "@/libs/services/M_Akun"
import { faEnvelope, faEye } from "@fortawesome/free-regular-svg-icons"
import { faArrowRight, faKey, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function LoginPage() {
    const router = useRouter()

    const [query, setQuery] = useState({
        callbackUrl: ''
    })

    const [loginLoading, setLoginLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [loginForm, setLoginForm] = useState({
        email: '', password: '', rememberMe: false
    })

    const submitLoginForm = async (e) => {
        e.preventDefault()

        setLoginLoading(true)
        const duration = loginForm.rememberMe ? 1000 * 60 * 60 * 7 : 1000 * 60 * 60 * 1

        const response = await M_Akun_login(loginForm.email, loginForm.password, duration)
        console.log(response)
        if(response.success) {
            swalToast.fire({
                title: 'Berhasil login!',
                icon: 'success'
            }).then(() => {
                if(query['callbackUrl'] !== '' ) {
                    router.push('/')
                }else{
                    router.push(query['callbackUrl'])
                }
            })
        }else{
            swalToast.fire({
                title: 'Gagal untuk login!',
                icon: 'error',
                text: response.message
            })
            setLoginLoading(false)
        }
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        const queryObject = {}
        searchParams.forEach((value, key) => {
            queryObject[key] = value
        })
        console.log(queryObject)
        setQuery(queryObject)
    }, [])

    return (
        <div className="bg-white dark:bg-zinc-900 md:bg-gradient-to-t md:from-blue-200 dark:md:from-blue-500/30  from-blue-50 to-white dark:to-zinc-900  md:to-cyan-50 w-full h-screen flex items-center justify-center text-zinc-700 dark:text-zinc-200">
            <form onSubmit={submitLoginForm} className="p-5 md:rounded-2xl w-full md:w-2/3 lg:w-1/3 h-full md:h-fit bg-transparent md:bg-white dark:md:bg-zinc-900 md:shadow-2xl dark:md:shadow-blue-500/10 flex md:block flex-col justify-between">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <Image src={'/logo-sekolah-2.png'} width={20} height={20} alt="Logo Sekolah" />
                        <h1 className="font-bold md:text-xl">
                            SI<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">KAP</span>
                        </h1>
                    </div>
                    <div className="text-end text-xs w-2/3 md:w-fit">
                        <p className="">Sistem Informasi Kehadiran dan Absensi Piket</p>
                        <p className="opacity-70">SMK Pekerjaan Umum Negeri Bandung</p>
                    </div>
                </div>
                <div className="md:my-10 md:px-20 space-y-2">
                    <div className="relative w-full flex justify-center">
                        <input type="text" disabled={loginLoading} required onChange={e => setLoginForm(state => ({...state, email: e.target.value}))} className="w-full rounded-full border border-zinc-100/0 bg-zinc-50 dark:bg-zinc-700 shadow-lg pl-12 pr-3 h-12 placeholder-shown:border-zinc-100 dark:placeholder-shown:border-zinc-800 placeholder-shown:shadow-none placeholder-shown:bg-zinc-50/0 dark:placeholder-shown:bg-zinc-700/0 transition-all duration-300 outline-none peer" placeholder="Masukkan Email anda" />
                        <div className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center peer-placeholder-shown:text-zinc-600 text-zinc-400">
                            <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-inherit" />
                        </div>
                    </div>
                    <div className="relative w-full flex justify-center">
                        <input disabled={loginLoading} type={`${showPass ? 'text' : 'password'}`} required onChange={e => setLoginForm(state => ({...state, password: e.target.value}))} className="w-full rounded-full border dark:bg-zinc-700 border-zinc-100/0 bg-zinc-50 shadow-lg pl-12 pr-3 h-12 placeholder-shown:border-zinc-100 dark:placeholder-shown:border-zinc-800 placeholder-shown:shadow-none placeholder-shown:bg-zinc-50/0 transition-all duration-300 outline-none peer" placeholder="Masukkan Password anda" />
                        <div className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center peer-placeholder-shown:text-zinc-600 text-zinc-400">
                            <FontAwesomeIcon icon={faKey} className="w-4 h-4 text-inherit" />
                        </div>
                        <button type="button"  onClick={() => setShowPass(state => !state)} className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center peer-placeholder-shown:text-zinc-600 text-zinc-400">
                            <FontAwesomeIcon icon={faEye} className="w-4 h-4 text-inherit" />
                        </button>
                    </div>
                    <div className="relative w-full">
                        <div className="flex items-center gap-5 text-xs md:text-sm">
                            <input type="checkbox" checked={loginForm['rememberMe']} onChange={() => setLoginForm(state => ({...state, rememberMe: !state['rememberMe']}))} />
                            Ingat Login saya
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <button type="submit" disabled={loginLoading} className="px-8 py-2 w-full md:w-fit rounded bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center gap-3 text-white hover:opacity-70 font-medium">
                        <span className={`${loginLoading ? 'hidden' : 'block'}`}>Masuk</span>
                        <FontAwesomeIcon icon={loginLoading ? faSpinner : faArrowRight} className={`w-4 h-4 text-inherit ${loginLoading && 'animate-spin'}`} />
                    </button>
                    <button type="button" className="px-8 py-2 w-full md:w-fit rounded border md:border-0 border-zinc-700  flex items-center justify-center gap-3  opacity-70 hover:opacity-100 font-medium">
                        Lupa Password
                        <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 text-inherit" />
                    </button>
                </div>
            </form>
        </div>
    )
}