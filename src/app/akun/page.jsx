'use client'

import MainLayoutPage from "@/components/mainLayout"
import { swalToast } from "@/libs/functions/toast"
import { get_uuid } from "@/libs/functions/uuid"
import { faEdit, faSave } from "@fortawesome/free-regular-svg-icons"
import { faAngleLeft, faAngleRight, faSearch, faTrash, faUserPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"

export default function AkunPage() {
    const router = useRouter()

    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [loadingFetch, setLoadingFetch] = useState('')
    const [selectedData, setSelectedData] = useState([])
    const [searchValue, setSearchValue] = useState('')
    
    const handleDeleteAkun = async () => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda akan menghapus akun tersebut!',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(async result => {
            if(result.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didOpen: async () => {
                        swalToast.fire({
                            title: 'Sukses menghapus akun tersebut',
                            icon: 'success'
                        })
                    }
                })
            }
        })
    }

    const handleDeleteSelectedAkun = async () => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda akan menghapus akun-akun tersebut!',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(async result => {
            if(result.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didOpen: async () => {
                        swalToast.fire({
                            title: 'Sukses menghapus akun tersebut',
                            icon: 'success'
                        })
                    }
                })
            }
        })
    }

    const submitTambahAkun = async (event, modal) => {
        event.preventDefault()

        const jsonBody = {
            id_akun: get_uuid(),
            email_akun: event.target[0].value,
            password_akun: event.target[1].value,
            nama_akun: event.target[2].value,
            role_akun: event.target[3].value
        }

        document.getElementById(modal).close()

        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda akan menambahkan akun tersebut!',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(async result => {
            if(result.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didOpen: async () => {
                        event.target[0].value = ''
                        event.target[1].value = ''
                        event.target[2].value = ''
                        event.target[3].value = ''
                        swalToast.fire({
                            title: 'Sukses menambahkan akun tersebut',
                            icon: 'success'
                        })
                    }
                })
            }else{
                document.getElementById(modal).showModal()
            }
        })
    }

    const submitUbahAkun = async (event, modal, id_akun) => {
        event.preventDefault()

        const jsonBody = {
            email_akun: event.target[0].value,
            password_akun: event.target[1].value,
            nama_akun: event.target[2].value,
            role_akun: event.target[3].value
        }

        console.log(jsonBody)

        document.getElementById(modal).close()

        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda akan mengubah akun tersebut!',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(async result => {
            if(result.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didOpen: async () => {
                        event.target[0].value = ''
                        event.target[1].value = ''
                        event.target[2].value = ''
                        event.target[3].value = ''
                        swalToast.fire({
                            title: 'Sukses mengubah akun tersebut',
                            icon: 'success'
                        })
                    }
                })
            }else{
                document.getElementById(modal).showModal()
            }
        })
    }

    const handleTotalList = value => {
        const maxPagination = Math.ceil(data.length / value)
        if(pagination > maxPagination) {
            setPagination(state => state = maxPagination)
        }
        setTotalList(value)
    }

    return (
        <MainLayoutPage>
            <Toaster />
            <div className="mt-5 dark:text-zinc-200 text-zinc-700">
                <button type="button" onClick={() => document.getElementById('tambah_akun').showModal()} className="px-4 py-2 rounded bg-blue-500 flex items-center justify-center gap-3 text-white dark:bg-zinc-950 dark:hover:bg-black hover:bg-blue-400">
                    <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4 text-inherit" />
                    Tambah
                </button>
                <dialog id="tambah_akun" className="modal">
                    <div className="modal-box bg-white dark:bg-zinc-800">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Buat Akun Baru</h3>
                        <hr className="my-2 opacity-0" />
                        <form onSubmitCapture={(e) => submitTambahAkun(e, "tambah_akun")} className="space-y-2">
                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                <p className="opacity-70 w-full md:w-2/5">
                                    Email
                                </p>
                                <input type="text" required className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700" placeholder="Masukkan Email" />
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                <p className="opacity-70 w-full md:w-2/5">
                                    Password
                                </p>
                                <input type="text" required className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700" placeholder="Masukkan Password" />
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                <p className="opacity-70 w-full md:w-2/5">
                                    Nama
                                </p>
                                <input type="text" required className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700" placeholder="Masukkan Nama" />
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                <p className="opacity-70 w-full md:w-2/5">
                                    Role
                                </p>
                                <select required className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700 cursor-pointer">
                                    <option value="Piket">Piket</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-5">
                                <button type="submit" className="px-3 py-2 rounded-full flex items-center justify-center gap-2 bg-green-500 dark:bg-green-500/10 hover:bg-green-400 dark:hover:bg-green-500/20 text-white dark:text-green-500 font-medium">
                                    <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
                <hr className="my-2 opacity-0" />
                <div className="grid grid-cols-12 rounded-xl border dark:border-zinc-700 *:px-3 *:py-3">
                    <div className="col-span-3 hidden md:flex items-center text-xs md:text-lg gap-2">
                        <input type="checkbox" name="" id="" />
                        Nama
                    </div>
                    <div className="col-span-7 md:col-span-3 flex items-center text-xs md:text-lg">
                        Email
                    </div>
                    <div className="col-span-2 hidden md:flex items-center text-xs md:text-lg">
                        Password
                    </div>
                    <div className="col-span-2 hidden md:flex items-center text-xs md:text-lg">
                        Role
                    </div>
                    <div className="col-span-5 md:col-span-2 flex items-center text-xs md:text-lg">
                        <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} className="w-full px-3 py-1 rounded outline-none dark:bg-zinc-800 bg-zinc-100" placeholder="Cari" />
                    </div>
                </div>
                <div className="space-y-2 my-1 relative overflow-auto max-h-[300px] md:max-h-[400px]">
                    {Array.from({ length: 20}, (_, index) => (
                        <div key={index} className="grid grid-cols-12 rounded-xl dark:hover:bg-zinc-950/50 hover:bg-zinc-100 *:px-3 *:py-3 transition-all duration-300">
                            <div className="col-span-3 hidden md:flex items-center text-xs md:text-lg gap-2">
                                <input type="checkbox" name="" id="" />
                                Ziyad Jahizh Kartiwa
                            </div>
                            <div className="col-span-7 md:col-span-3 flex items-center text-xs md:text-lg opacity-100 md:opacity-60">
                                kakangtea74@gmail.com
                            </div>
                            <div className="col-span-2 hidden md:flex items-center text-xs md:text-lg opacity-100 md:opacity-60">
                                ziyadzk207a
                            </div>
                            <div className="col-span-2 hidden md:flex items-center text-xs md:text-lg opacity-100 md:opacity-60">
                                Admin
                            </div>
                            <div className="col-span-5 md:col-span-2 flex items-center text-xs md:text-lg justify-center gap-2">
                                <button type="button" onClick={() => document.getElementById(`info_akun_${index}`).showModal()} className="w-6 h-6 rounded bg-blue-500 hover:bg-blue-400 focus:bg-blue-600 md:hidden flex items-center justify-center text-white">
                                    <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit" />
                                </button>
                                <dialog id={`info_akun_${index}`} className="modal">
                                    <div className="modal-box bg-white dark:bg-zinc-800">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                        </form>
                                        <h3 className="font-bold text-lg">Info Akun</h3>
                                        <hr className="my-2 opacity-0" />
                                        <div className="space-y-2">
                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                <p className="opacity-70 w-full md:w-2/5">
                                                    Email
                                                </p>
                                                <input disabled type="text" className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700" placeholder="Masukkan Email" />
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                <p className="opacity-70 w-full md:w-2/5">
                                                    Password
                                                </p>
                                                <input disabled type="text" className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700" placeholder="Masukkan Password" />
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                <p className="opacity-70 w-full md:w-2/5">
                                                    Nama
                                                </p>
                                                <input disabled type="text" className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700" placeholder="Masukkan Nama" />
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                <p className="opacity-70 w-full md:w-2/5">
                                                    Role
                                                </p>
                                                <select disabled className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700 cursor-pointer">
                                                    <option value="Piket">Piket</option>
                                                    <option value="Admin">Admin</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </dialog>
                                <button type="button" onClick={() => document.getElementById(`ubah_akun_${index}`).showModal()} className="w-6 h-6 rounded bg-amber-500 hover:bg-amber-400 focus:bg-amber-600 flex items-center justify-center text-white">
                                    <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                </button>
                                <dialog id={`ubah_akun_${index}`} className="modal">
                                    <div className="modal-box bg-white dark:bg-zinc-800">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                        </form>
                                        <h3 className="font-bold text-lg">Ubah Akun</h3>
                                        <hr className="my-2 opacity-0" />
                                        <form onSubmit={e => submitUbahAkun(e, `ubah_akun_${index}`, index)} className="space-y-2">
                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                <p className="opacity-70 w-full md:w-2/5">
                                                    Email
                                                </p>
                                                <input type="text" required className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700" placeholder="Masukkan Email" />
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                <p className="opacity-70 w-full md:w-2/5">
                                                    Password
                                                </p>
                                                <input type="text" required className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700" placeholder="Masukkan Password" />
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                <p className="opacity-70 w-full md:w-2/5">
                                                    Nama
                                                </p>
                                                <input type="text" required className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700" placeholder="Masukkan Nama" />
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                <p className="opacity-70 w-full md:w-2/5">
                                                    Role
                                                </p>
                                                <select required className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700 cursor-pointer">
                                                    <option value="Piket">Piket</option>
                                                    <option value="Admin">Admin</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-5">
                                                <button type="submit" className="px-3 py-2 rounded-full flex items-center justify-center gap-2 bg-green-500 dark:bg-green-500/10 hover:bg-green-400 dark:hover:bg-green-500/20 text-white dark:text-green-500 font-medium">
                                                    <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                    Simpan
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </dialog>
                                <button type="button" onClick={() => handleDeleteAkun()} className="w-6 h-6 rounded bg-red-500 hover:bg-red-400 focus:bg-red-600 flex items-center justify-center text-white">
                                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between px-3 py-4 flex-col md:flex-row gap-1">
                    <div className="flex items-center gap-5 justify-between md:justify-start">
                        <p className="text-xs md:text-lg">
                            <b>{selectedData.length}</b> <span className="opacity-70">Data dipilih</span>
                        </p>
                        <div className={`${selectedData.length > 0 ? 'flex' : 'hidden'} items-center gap-2`}>
                            <button type="button" onClick={() => handleDeleteSelectedAkun()} className="w-6 h-6 rounded dark:bg-zinc-800 bg-zinc-100 flex items-center justify-center group">
                                <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit opacity-60 group-hover:opacity-100" />
                            </button>
                            <button type="button" className="w-6 h-6 rounded dark:bg-zinc-800 bg-zinc-100 flex items-center justify-center group">
                                <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit opacity-60 group-hover:opacity-100" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 justify-between md:justify-start">
                        <p className="text-xs md:text-lg">
                            Total <span className="font-bold">{data.length}</span> Data
                        </p>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)} className="w-6 h-6 flex items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800 group">
                                <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit opacity-70 group-hover:opacity-100" />
                            </button>
                            <p className="text-xs md:text-lg">
                                {pagination}
                            </p>
                            <button type="button" onClick={() => setPagination(state => state < Math.ceil(data.length / totalList) ? state + 1 : state)} className="w-6 h-6 flex items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800 group">
                                <FontAwesomeIcon icon={faAngleRight} className="w-3 h-3 text-inherit opacity-70 group-hover:opacity-100" />
                            </button>
                        </div>
                        <select value={totalList} onChange={e => handleTotalList(e.target.value)} className="px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800 outline-none cursor-pointer">
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}