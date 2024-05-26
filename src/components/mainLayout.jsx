'use client'

import { jakarta } from "@/libs/fonts"
import { getLoggedUserdata } from "@/libs/functions/userdata"
import { logoutAkun } from "@/libs/services/S_Akun"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

const { faFileArchive, faUser, faSun, faMoon } = require("@fortawesome/free-regular-svg-icons")
const { faHouse, faPrint, faXmark, faBars, faSpinner, faSignOut, faBook } = require("@fortawesome/free-solid-svg-icons")

const navLinkMasterData = [
    { title: 'Akun', icon: faUser, url: '/akun', page: 'Daftar Akun'},
    { title: 'Surat Izin', icon: faFileArchive, url: '/surat', page: 'Daftar Surat Izin'}, 
    { title: 'Export', icon: faPrint, url: '/export', page: 'Export Surat Izin'}
]

const navLink = [
    ...navLinkMasterData,
    { title: 'Dashboard', icon: faHouse, url: '/', page: 'Dashboard Page'}
]

export default function MainLayoutPage({children}) {
    const router = useRouter()
    const path = usePathname();
    const [filteredPath, setFilteredPath] = useState(null)
    const [loggedAkun, setLoggedAkun] = useState(null)
    const [theme, setTheme] = useState('')

    const getLoggedAkun = async () => {
        const userdata = await getLoggedUserdata()
        
        setLoggedAkun(userdata)
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

    const [showSidebar, setShowSidebar] = useState(false)

    const submitLogout = async () => {
        return Swal.fire({
            title: 'Apakah anda yakin?',
            confirmButtonColor: '#09090b',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(async result => {
            if(result.isConfirmed) {
               Swal.fire({
                    title: 'Sedang memproses data..',
                    text: 'Harap menunggu..',
                    timer: 10000,
                    allowOutsideClick: false,
                    showConfirmButton: false
                })
                await logoutAkun();
               Swal.close()
                return router.push('/login')
            }
        })
    }

    return (
        <div className="w-full h-screen bg-white dark:bg-zinc-900">
            {showSidebar && <SidebarSection setShowSidebar={setShowSidebar} />}
            <nav className="fixed top-0 left-0 px-5 py-3 border-b border-zinc-300 dark:border-zinc-800 shadow-lg w-full flex items-center z-50 bg-white dark:bg-zinc-900 gap-5 md:gap-0">
                <div className="w-2/12">    
                    <div className="flex items-center gap-5">
                        <Image src={'/logo-sekolah-2.png'} width={15} height={15} alt="Logo Sekolah" className="w-5 h-5 md:w-fit md:h-fit" />
                        <h1 className={`${jakarta.className} font-bold text-gray-800 dark:text-zinc-200 text-xs md:text-sm`}>SI<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">KAP</span></h1>
                    </div>
                </div>
                <div className="w-10/12 flex justify-between items-center">
                    <div className="flex items-center gap-3">   
                        <button type="button" onClick={() => setShowSidebar(state => !state)} className="md:hidden flex items-center justify-center swap swap-rotate  text-blue-600 btn btn-sm bg-transparent border-0">
                            <FontAwesomeIcon icon={showSidebar ? faXmark : faBars} className="w-3 h-3 text-inherit" />
                        </button>
                        <h1 className={`${jakarta.className} text-blue-800 dark:text-blue-500 hidden md:flex font-medium text-xl tracking-wide w-fit  items-center gap-3`}>
                            <FontAwesomeIcon icon={filteredPath ? filteredPath.icon : faSpinner} className={`w-4 h-4 text-inherit ${!filteredPath ? 'animate-spin' : ''}`} />
                            {filteredPath ? filteredPath.page : ''}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3  rounded px-3 py-1">
                        <article className="text-end">
                            <h1 className={`${jakarta.className} text-zinc-700 dark:text-zinc-400 text-xs font-medium md:text-sm`}>
                                {loggedAkun !== null ? loggedAkun.email_akun : <div className="w-16 h-4 bg-zinc-300 animate-pulse rounded"></div>}
                            </h1>
                            <p className={`${jakarta.className} text-zinc-700 text-xs dark:text-zinc-500`}>
                                {loggedAkun !== null ? loggedAkun.role_akun : <span className="w-16 h-4 bg-zinc-300 animate-pulse rounded"></span>}
                            </p>
                        </article>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => submitLogout()} className={`${jakarta.className} btn btn-error btn-sm flex items-center justify-center gap-3`}>
                                <FontAwesomeIcon icon={faSignOut} className="w-3 h-3 text-inherit" />
                                <span className="hidden md:block">Keluar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className={`flex h-full ${jakarta.className}`}>
                <div className="hidden md:block relative overflow-auto w-2/12 border-r border-zinc-300 dark:border-zinc-800 h-full text-zinc-800 pt-16 bg-zinc-50 dark:bg-zinc-950">
                    <hr className="my-2 opacity-0" />
                    <div className="px-5">
                        <div className="space-y-2">
                            <a href="/" className={`flex items-center justify-between tracking-tighter text-sm ${path === '/' ? 'bg-white dark:bg-zinc-800/50 shadow-lg dark:shadow-black/50 text-zinc-800 dark:text-white' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800/50 text-zinc-400 dark:text-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-500 group'}  font-medium rounded-lg px-3 py-2`}>
                                <span className="flex items-center gap-5">
                                    <FontAwesomeIcon icon={faHouse} className={`w-4 h-4  ${path === '/' ? 'text-rose-600' : 'text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400'} `} />
                                    Dashboard
                                </span>
                                <span className={`w-2 h-2 rounded-full bg-blue-600/50 animate-ping ${filteredPath && filteredPath.url === '/' ? 'block' : 'hidden'} `}></span>
                            </a>
                            {loggedAkun && navLinkMasterData.map((nav, index) =>  (
                                <a key={index} href={nav.url} className={`flex items-center text-sm justify-between tracking-tighter ${filteredPath && filteredPath.url.startsWith(nav.url) ? 'bg-white dark:bg-zinc-800/50 shadow-lg text-zinc-800 dark:text-zinc-400' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800/50 text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 group'}  font-medium rounded-lg px-3 py-2`}>
                                    <span className="flex items-center gap-6">
                                        <FontAwesomeIcon icon={nav.icon} className={`w-4 h-4  ${filteredPath && filteredPath.url.startsWith(nav.url) ? 'text-blue-600' : 'text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400'} `} />
                                        {nav.title}
                                    </span>
                                    <span className={`w-2 h-2 rounded-full bg-blue-600/50 ${filteredPath && filteredPath.url.startsWith(nav.url) ? 'block' : 'hidden'} animate-ping`}></span>
                                </a>
                            ))}
                        </div>
                        <hr className="my-5 dark:opacity-30" />
                        <div className="flex justify-between items-center">
                            <p className="text-sm opacity-60 dark:opacity-100 dark:text-zinc-600">
                                Ubah Tema
                            </p>
                            <button type="button" onClick={() => toggleTheme()} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                {theme === 'dark' ? 'Terang' : 'Gelap'}
                                <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="w-3 h-3 text-inherit" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className={`${jakarta.className} w-full md:w-10/12 px-5 pt-16 h-full text-zinc-800 relative overflow-auto`}>
                    <hr className="block md:hidden my-1 opacity-0" />
                    <h1 className={`${jakarta.className} text-blue-600 md:hidden flex font-medium text-xl tracking-wide w-fit  items-center gap-3`}>
                        <FontAwesomeIcon icon={ filteredPath ? filteredPath.icon : faSpinner} className={`w-4 h-4 text-inherit ${!filteredPath ? 'animate-spin' : ''}`} />
                        { filteredPath ? filteredPath.page : '' }
                    </h1>
                    <hr className="my-1 opacity-0" />
                    {children}
                </div>
            </div>
        </div>
    )
}

function SidebarSection() {
    const router = useRouter()
    const path = usePathname();
    const [filteredPath, setFilteredPath] = useState(null)
    const [loggedAkun, setLoggedAkun] = useState(null)

    const [theme, setTheme] = useState('')

    const getLoggedAkun = async () => {
        const userdata = await getLoggedUserdata()
        setLoggedAkun(userdata)
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
    return (
        <div className="fixed top-0 left-0 w-full h-screen overflow-auto bg-white dark:bg-zinc-900 z-50 md:hidden block">
            <hr className="mt-20 opacity-0" />
            <div className={`px-5 ${jakarta.className}`}>
                
                <div className="space-y-2">
                    <a href="/" className={`flex items-center justify-between tracking-tighter text-sm ${path === '/' ? 'bg-white dark:bg-zinc-800/50 shadow-lg dark:shadow-black/50 text-zinc-800 dark:text-white' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800/50 text-zinc-400 dark:text-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-500 group'}  font-medium rounded-lg px-3 py-2`}>
                        <span className="flex items-center gap-5">
                            <FontAwesomeIcon icon={faHouse} className={`w-4 h-4  ${path === '/' ? 'text-rose-600' : 'text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400'} `} />
                            Dashboard
                        </span>
                        <span className={`w-2 h-2 rounded-full bg-blue-600/50 animate-ping ${filteredPath && filteredPath.url === '/' ? 'block' : 'hidden'} `}></span>
                    </a>
                    {loggedAkun && navLinkMasterData.map((nav, index) =>  (
                        <a key={index} href={nav.url} className={`flex items-center text-sm justify-between tracking-tighter ${filteredPath && filteredPath.url.startsWith(nav.url) ? 'bg-white dark:bg-zinc-800/50 shadow-lg text-zinc-800 dark:text-zinc-400' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800/50 text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 group'}  font-medium rounded-lg px-3 py-2`}>
                            <span className="flex items-center gap-6">
                                <FontAwesomeIcon icon={nav.icon} className={`w-4 h-4  ${filteredPath && filteredPath.url.startsWith(nav.url) ? 'text-blue-600' : 'text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400'} `} />
                                {nav.title}
                            </span>
                            <span className={`w-2 h-2 rounded-full bg-blue-600/50 ${filteredPath && filteredPath.url.startsWith(nav.url) ? 'block' : 'hidden'} animate-ping`}></span>
                        </a>
                    ))}
                </div>
                <hr className="my-5" />
                <div className="flex justify-between items-center">
                    <p className="text-sm opacity-60">
                        Ubah Tema
                    </p>
                    <button type="button" onClick={() => toggleTheme()} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-100 text-zinc-600 text-sm hover:bg-zinc-200 focus:bg-zinc-300">
                        {theme === 'dark' ? 'Terang' : 'Gelap'}
                        <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="w-3 h-3 text-inherit" />
                    </button>
                </div>
            </div>
        </div>
    )
}