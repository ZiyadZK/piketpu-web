'use client'

import { jakarta } from "@/libs/fonts"
import { getLoggedUserdata } from "@/libs/functions/userdata"
import { M_Akun_logout } from "@/libs/services/M_Akun"
import { faBookBookmark, faCog, faFileCircleExclamation, faHouse, faMoon, faSearch, faSignOut, faSun, faTimeline, faUserLock } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const mySwal = withReactContent(Swal)

const ContextLoggedData = createContext()

const navLinkMasterData = [
    { title: 'Surat', icon: faBookBookmark, url: '/surat', page: 'Data Surat', role: ['Operator', 'Admin']},
    { title: 'Akun', icon: faUserLock, url: '/akun', page: 'Data Akun', role: ['Admin']},
    { title: 'Riwayat', icon: faTimeline, url: '/riwayat', page: 'Data Riwayat', role: ['Admin']}
]

const navLink = [
    ...navLinkMasterData,
    { title: 'Dashboard', icon: faHouse, url: '/', page: 'Dashboard Page', role: ['Operator', 'Admin']},
    { title: 'Detail Siswa', icon: faFileCircleExclamation, url: '/detail', page: 'Detail Siswa', role: ['Operator', 'Admin']}
]

export default function MainLayoutPublicPage({children}) {
    const router = useRouter()
    const path = usePathname();
    const [theme, setTheme] = useState('')

    const getTheme = () => {
        const themeData = localStorage.getItem('theme') || 'light'
        if(themeData === 'dark') {
            document.body.classList.add('dark')
        }else{
            document.body.classList.remove('dark')
        }

        setTheme(themeData)
    }

    const toggleTheme = () => {
        if(theme === 'dark') {
            localStorage.setItem('theme', 'light')
            document.body.classList.remove('dark')
            setTheme('light')
        }else{
            localStorage.setItem('theme', 'dark')
            document.body.classList.add('dark')
            setTheme('dark')
        }
    }

    useEffect(() => {
        getTheme()
    }, [])


    return (
        <div className={`drawer ${jakarta.className} dark:text-zinc-100 text-zinc-700`}>
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content w-full bg-zinc-100 dark:bg-zinc-950">
                <div className="px-5 bg-white sticky top-0 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800 py-5 space-y-2 z-10">
                    <div className="flex justify-between w-full items-center">
                        <div className="flex items-center divide-x divide-zinc-300 dark:divide-zinc-800">
                            <Link href={'/'} className="flex items-center gap-3 pr-3 md:pr-5">
                                <Image src={'/logo-sekolah-2.png'} width={15} height={15} alt="Logo Sekolah" />
                                <h1 className="font-bold tracking-tighter hidden md:block">
                                    SI<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">KAP</span>
                                </h1>
                            </Link>
                            <div className="pl-3 md:pl-5 flex items-center gap-3">
                                <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit" />
                                Cek Siswa
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => toggleTheme()} className="rounded-full border w-8 h-8 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300 flex items-center justify-center group text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200">
                                <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-4 h-4 text-inherit group-hover:-rotate-45 transition-all duration-300" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="px-3  md:pt-5 md:px-10 pt-3 pb-10 relative overflow-auto w-full min-h-screen  text-zinc-700 dark:text-zinc-200">
                    {children}
                </div>
            </div> 
            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 min-h-full w-80 text-xs">
                    <hr className="my-12 opacity-0" />
                    
                </div>
            </div>
        </div> 
    )
}