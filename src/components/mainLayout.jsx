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
    { title: 'Surat', icon: faBookBookmark, url: '/surat', page: 'Data Surat', role: ['Piket', 'Admin']},
    { title: 'Akun', icon: faUserLock, url: '/akun', page: 'Data Akun', role: ['Admin']},
    { title: 'Riwayat', icon: faTimeline, url: '/riwayat', page: 'Data Riwayat', role: ['Admin']}
]

const navLink = [
    ...navLinkMasterData,
    { title: 'Dashboard', icon: faHouse, url: '/', page: 'Dashboard Page', role: ['Piket', 'Admin']},
    { title: 'Detail Siswa', icon: faFileCircleExclamation, url: '/detail', page: 'Detail Siswa', role: ['Piket', 'Admin']}
]

export default function MainLayoutPage({children}) {
    const router = useRouter()
    const path = usePathname();
    const [filteredPath, setFilteredPath] = useState(null)
    const [loggedAkun, setLoggedAkun] = useState(null)
    const [theme, setTheme] = useState('')

    const getLoggedAkun = async () => {
        const response = await getLoggedUserdata()
        if(response.success) {
            setLoggedAkun(response.data)
        }else{
            router.push('/login')
        }
    }

    const getFilteredPath = () => {
        const updatedPath = navLink.find(item => path === item.url || (path.startsWith(item.url) && item.url !== '/'))
        setFilteredPath(updatedPath)
    }

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
        getLoggedAkun()
        getFilteredPath()
        getTheme()
    }, [])

    const [hoveredPath, setHoveredPath] = useState(path)

    const submitLogout = async () => {
        return mySwal.fire({
            title: 'Apakah anda yakin?',
            confirmButtonColor: '#09090b',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(async result => {
            if(result.isConfirmed) {
                mySwal.fire({
                    title: 'Sedang memproses data..',
                    text: 'Harap menunggu..',
                    timer: 10000,
                    allowOutsideClick: false,
                    showConfirmButton: false
                })
                await M_Akun_logout();
                mySwal.close()
                return router.push('/login')
            }
        })
    }

    return (
        <ContextLoggedData.Provider value={{ loggedAkun, setLoggedAkun}}>
            <div className={`drawer ${jakarta.className} dark:text-zinc-100 text-zinc-700`}>
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content w-full bg-zinc-100 dark:bg-zinc-950">
                    <div className="px-5 bg-white sticky top-0 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800 pt-5 space-y-2 z-10">
                        <div className="flex justify-between w-full items-center">
                            <div className="flex items-center divide-x divide-zinc-300 dark:divide-zinc-800">
                                <Link href={'/'} className="flex items-center gap-3 pr-3 md:pr-5">
                                    <Image src={'/logo-sekolah-2.png'} width={15} height={15} alt="Logo Sekolah" />
                                    <h1 className="font-bold tracking-tighter hidden md:block">
                                        SI<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">KAP</span>
                                    </h1>
                                </Link>
                                {!filteredPath ? (
                                    <div className="loading loading-spinner loading-sm text-zinc-400 pl-3 md:pl-5 py-3"></div>
                                ):(
                                    <div className="pl-3 md:pl-5 flex items-center gap-3">
                                        <FontAwesomeIcon icon={filteredPath.icon} className="w-3 h-3 text-inherit" />
                                        {filteredPath.title}
                                    </div>
                                )}
                            </div>
                            {!loggedAkun ? (
                                <div className="loading loading-spinner loading-sm text-zinc-400 py-2"></div>
                            ):(
                                <div className="flex items-center gap-3">
                                    <div className="hidden md:flex items-center gap-3 ">
                                        {loggedAkun['role_akun'] === 'Admin' && (
                                            <p className="px-2 py-1 rounded-full text-xs font-medium border bg-red-500/20 text-red-500 border-red-500">
                                                Admin
                                            </p>
                                        )}
                                        {loggedAkun['role_akun'] === 'Operator' && (
                                            <p className="px-2 py-1 rounded-full text-xs font-medium border bg-amber-500/20 text-amber-500 border-amber-500">
                                                Operator
                                            </p>
                                        )}
                                        <article className="text-end">
                                            <p className="text-xs">
                                                {loggedAkun['email_akun']}
                                            </p>
                                            <p className="text-xs opacity-50">
                                                {loggedAkun['nama_akun']}
                                            </p>
                                        </article>
                                    </div>
                                    <button type="button" onClick={() => toggleTheme()} className="rounded-full border w-8 h-8 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300 hidden md:flex items-center justify-center group text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200">
                                        <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-4 h-4 text-inherit group-hover:-rotate-45 transition-all duration-300" />
                                    </button>
                                    <label htmlFor="my-drawer" className="rounded-full border w-8 h-8 dark:border-zinc-800 hover:bg-zinc-50 transition-all duration-300 dark:hover:bg-zinc-800 flex md:hidden items-center justify-center group text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 drawer-button">
                                        <FontAwesomeIcon icon={faCog} className="w-4 h-4 text-inherit group-hover:-rotate-45 transition-all duration-300" />
                                    </label>
                                    <button type="button" onClick={() => submitLogout()} className="rounded-full border w-8 h-8 dark:border-zinc-800 hover:bg-zinc-50 transition-all duration-300 dark:hover:bg-zinc-800 hidden md:flex items-center justify-center group text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200">
                                        <FontAwesomeIcon icon={faSignOut} className="w-4 h-4 text-inherit transition-all duration-300" />
                                    </button>
                                </div>
                            )}
                        </div>
                        {!filteredPath ? (
                            <div className="loading loading-spinner loading-sm text-zinc-400 py-4"></div>
                        ):(
                            <div className="flex items-center overflow-auto relative w-full pb-2">
                                {loggedAkun && navLinkMasterData.map((nav, index) => nav['role'].includes(loggedAkun.role_akun) && (
                                    <Link
                                        key={index} 
                                        href={nav.url}
                                        className={`px-4 py-2 rounded-md text-xs font-medium  flex-shrink-0 ${filteredPath && filteredPath.url.startsWith(nav.url) ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400'} hover:text-zinc-700 dark:hover:text-zinc-200 relative no-underline duration-300 ease-in z-[100]`}
                                        onMouseOver={() => setHoveredPath(nav.url)}
                                        onMouseLeave={() => setHoveredPath(path)}
                                    >
                                        <span>
                                            {nav.title}
                                        </span>
                                        {hoveredPath.startsWith(nav.url) && (
                                            <motion.div
                                                className="absolute bottom-0 left-0 h-full bg-zinc-100 dark:bg-zinc-800 rounded-md -z-10 text-zinc-700 dark:text-zinc-200"
                                                layoutId="navbar"
                                                aria-hidden="true"
                                                style={{
                                                    width: "100%",
                                                }}
                                                transition={{
                                                    type: 'spring',
                                                    bounce: 0,
                                                    stiffness: 200,
                                                    damping: 30,
                                                    duration: 0.01,
                                                }}
                                            />
                                        )}
                                        
                                    </Link>
                                ))}
                                <Link href={'/ceksiswa'} className="px-3 py-2 text-xs rounded-md bg-blue-500 hover:bg-blue-400 focus:bg-blue-600 flex items-center justify-center gap-3 text-white">
                                    <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit opacity-60" />
                                    Cek Siswa
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="px-3  md:pt-5 md:px-10 pt-3 pb-10 relative overflow-auto w-full min-h-screen  text-zinc-700 dark:text-zinc-200">
                        {children}
                    </div>
                </div> 
                <div className="drawer-side">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 min-h-full w-80 text-xs">
                        <hr className="my-12 opacity-0" />
                        {loggedAkun && (
                            <div className="p-5">
                                <h1>
                                    {loggedAkun['email_akun']}
                                </h1>
                                <h2 className="opacity-50">
                                    {loggedAkun['nama_akun']}
                                </h2>
                                <hr className="my-3 dark:opacity-10" />
                                {loggedAkun['role_akun'] === 'Admin' && (
                                    <p className="px-2 py-1 rounded-full w-fit text-xs font-medium border bg-red-500/20 text-red-500 border-red-500">
                                        Admin
                                    </p>
                                )}
                                {loggedAkun['role_akun'] === 'Operator' && (
                                    <p className="px-2 py-1 rounded-full w-fit text-xs font-medium border bg-amber-500/20 text-amber-500 border-amber-500">
                                        Operator
                                    </p>
                                )}
                                <hr className="my-3 dark:opacity-10" />
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <p className="opacity-60">
                                            Tema
                                        </p>
                                        <button type="button" onClick={() => toggleTheme()} className="rounded-full border w-8 h-8 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300 flex items-center justify-center group text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200">
                                            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-4 h-4 text-inherit group-hover:-rotate-45 transition-all duration-300" />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="opacity-60">
                                            Keluar
                                        </p>
                                        <button type="button" onClick={() => submitLogout()} className="rounded-full border w-8 h-8 dark:border-zinc-700 hover:bg-zinc-50 transition-all duration-300 dark:hover:bg-zinc-900 flex items-center justify-center group text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200">
                                            <FontAwesomeIcon icon={faSignOut} className="w-4 h-4 text-inherit transition-all duration-300" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ContextLoggedData.Provider>
    )
}

export const useContextLoggedData = () => useContext(ContextLoggedData)