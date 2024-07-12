'use client'

import MainLayoutPage from "@/components/mainLayout"
import { swalToast } from "@/libs/functions/toast"
import { get_uuid } from "@/libs/functions/uuid"
import { M_Akun_create, M_Akun_delete, M_Akun_getAll, M_Akun_update } from "@/libs/services/M_Akun"
import { M_Pegawai_getAll } from "@/libs/services/M_Pegawai"
import { faEdit, faSave } from "@fortawesome/free-regular-svg-icons"
import { faAngleLeft, faAngleRight, faSearch, faTrash, faUserPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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
    const [dataPegawai, setDataPegawai] = useState([])
    const [filteredDataPegawai, setFilteredDataPegawai] = useState([])
    const [searchDataPegawai, setSearchDataPegawai] = useState('')
    const [selectedDataPegawai, setSelectedDataPegawai] = useState({})
    const [fetchDataPegawai, setFetchDataPegawai] = useState('')
    
    const handleDeleteAkun = async (id_akun) => {
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
                        const response = await M_Akun_delete(typeof(id_akun) !== 'undefined' ? id_akun : selectedData)
                        
                        if(response.success) {
                            swalToast.fire({
                                title: 'Sukses',
                                text: 'Berhasil menghapus akun tersebut!',
                                icon: 'success'
                            })
                            setSelectedData([])
                            await getData()
                        }else{
                            swalToast.fire({
                                title: 'Error',
                                text: 'Gagal menghapus akun tersebut!',
                                icon: 'error'
                            })
                        }
                    }
                })
            }
        })
    }

    const submitTambahAkun = async (event, modal) => {
        event.preventDefault()

        const jsonBody = {
            piket_id_pegawai: selectedDataPegawai['piket_id_pegawai'],
            nama_akun: selectedDataPegawai['nama_akun'],
            nickname_akun: event.target[0].value,
            email_akun: selectedDataPegawai['email_akun'],
            password_akun: event.target[1].value,
            role_akun: event.target[2].value
        }

        console.log(jsonBody)

        if(Object.values(jsonBody).includes(undefined)) {
            return
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
                        const response = await M_Akun_create(jsonBody)
                        if(response.success) {
                            event.target[0].value = ''
                            event.target[1].value = ''
                            event.target[2].value = ''
                            event.target[3].value = ''
                            swalToast.fire({
                                title: 'Sukses',
                                text: 'Berhasil menambahkan akun baru',
                                icon: 'success'
                            })
                            await getData()
                        }else{
                            Swal.fire({
                                title: 'Gagal',
                                text: 'Gagal menambahkan akun baru!',
                                icon: 'error'
                            }).then(() => {
                                document.getElementById(modal).showModal()
                            })
                        }
                    }
                })
            }else{
                document.getElementById(modal).showModal()
            }
        })
    }

    const submitUbahAkun = async (event, modal, id_akun) => {
        event.preventDefault()

        const payload = {
            nickname_akun: event.target[0].value,
            password_akun: event.target[1].value,
            role_akun: event.target[2].value
        }

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
                        const response = await M_Akun_update(id_akun, payload)

                        if(response.success) {
                            swalToast.fire({
                                title: 'Sukses mengubah akun tersebut',
                                icon: 'success'
                            })
                            await getData()
                        }else{
                            Swal.fire({
                                title: 'Error',
                                text: 'Gagal mengubah akun tersebut!',
                                timer: 3000,
                                timerProgressBar: true,
                                icon: 'error'
                            }).then(() => {
                                document.getElementById(modal).showModal()
                            })
                        }
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

    const getData = async () => {
        setLoadingFetch('loading')
        const response = await M_Akun_getAll()
        if(response.success) {
            setData(response.data)
            setFilteredData(response.data)
        }
        setLoadingFetch('fetched')
    }

    const getDataPegawai = async () => {
        const response = await M_Pegawai_getAll()
        if(response.success) {
            setDataPegawai(response.data)
            setFilteredDataPegawai(response.data)
        }
        setFetchDataPegawai('fetched')
    }

    useEffect(() => {
        getData()
        getDataPegawai()
    }, [])

    const handleSelectedData = (id_akun) => {
        let updatedData = selectedData

        if(selectedData.includes(id_akun)) {
            updatedData = updatedData.filter(value => value !== id_akun)
            setSelectedData(updatedData)
        }else{
            setSelectedData(state => [...state, id_akun])
        }
    }

    const filterDataPegawai = () => {
        let updatedData = dataPegawai

        if(searchDataPegawai !== '') {
            updatedData = updatedData.filter(value => 
                value['nama_pegawai'].toLowerCase().includes(searchDataPegawai.toLowerCase())
            )
        }

        setFilteredDataPegawai(updatedData)
    }

    useEffect(() => {
        filterDataPegawai()
    }, [searchDataPegawai])

    const selectDataPegawai = (piket_id_pegawai, nama_akun, email_akun) => {
        setSelectedDataPegawai({piket_id_pegawai, nama_akun, email_akun})
    }

    return (
        <MainLayoutPage>
            <Toaster />
            <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-xs">
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
                        <div className="flex flex-col md:flex-row md:items-center gap-1">
                            <p className="opacity-70 w-full md:w-2/5">
                                Pilih Pegawai
                            </p>
                            <input type="text" value={searchDataPegawai} onChange={e => setSearchDataPegawai(e.target.value)} className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700" placeholder="Cari pegawai" />
                        </div>
                        <hr className="my-2 opacity-0" />
                        <div className="flex items-center p-3 border rounded-lg dark:border-zinc-700">
                            <p className="w-3/5 text-xs opacity-50">
                                Nama Pegawai
                            </p>
                            <p className="w-2/5 text-xs opacity-50">
                                Jabatan
                            </p>
                        </div>
                        {fetchDataPegawai !== 'fetched' && (
                            <div className="w-full flex items-center justify-center gap-3 py-5 opacity-50">
                                <div className="loading loading-md loading-spinner"></div>
                                Sedang mendapatkan data
                            </div>
                        )}
                        {fetchDataPegawai === 'fetched' && (
                            <div className="py-2 relative w-full overflow-auto max-h-[250px]">
                                {filteredDataPegawai.map((value, index) => (
                                    <button type="button" onClick={() => selectDataPegawai(value['id_pegawai'], value['nama_pegawai'], value['email_pegawai'])} key={index} className="flex items-center p-3 rounded-lg  hover:bg-zinc-50 dark:hover:bg-zinc-700/50 w-full text-start">
                                        <p className="w-3/5 text-xs">
                                            {value['nama_pegawai']}
                                        </p>
                                        <p className="w-2/5 text-xs opacity-50">
                                            {value['jabatan']}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                        <hr className="my-2 opacity-0" />
                        <form onSubmitCapture={(e) => submitTambahAkun(e, "tambah_akun")} className="space-y-2">
                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                <p className="opacity-70 w-full md:w-2/5">
                                    ID Pegawai
                                </p>
                                <p className="w-full md:w-3/5">
                                    {selectedDataPegawai['piket_id_pegawai']}
                                </p>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                <p className="opacity-70 w-full md:w-2/5">
                                    Nama Pegawai
                                </p>
                                <p className="w-full md:w-3/5">
                                    {selectedDataPegawai['nama_akun']}
                                </p>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                <p className="opacity-70 w-full md:w-2/5">
                                    Nickname
                                </p>
                                <input type="text" required className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700" placeholder="Masukkan Nama Pendek" />
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                <p className="opacity-70 w-full md:w-2/5">
                                    Email
                                </p>
                                <p className="w-full md:w-3/5">
                                    {selectedDataPegawai['email_akun']}
                                </p>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                <p className="opacity-70 w-full md:w-2/5">
                                    Password
                                </p>
                                <input type="text" required className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700" placeholder="Masukkan Password" />
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
                        <p className="opacity-60">Nama</p>
                    </div>
                    <div className="col-span-7 md:col-span-3 flex items-center text-xs md:text-lg opacity-60">
                        Email
                    </div>
                    <div className="col-span-2 hidden md:flex items-center text-xs md:text-lg opacity-60">
                        Password
                    </div>
                    <div className="col-span-2 hidden md:flex items-center text-xs md:text-lg opacity-60">
                        Role
                    </div>
                    <div className="col-span-5 md:col-span-2 flex items-center text-xs md:text-lg">
                        <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} className="w-full px-3 py-1 rounded outline-none dark:bg-zinc-800 bg-zinc-100" placeholder="Cari" />
                    </div>
                </div>
                {loadingFetch !== 'fetched' && (
                    <div className="w-full flex justify-center items-center gap-5 py-5">
                        <div className="loading loading-md loading-spinner text-zinc-500"></div>
                        <p className="opacity-50">Sedang mendapatkan data</p>
                    </div>
                )}
                {loadingFetch === 'fetched' && (
                    <div className="space-y-2 my-1 relative overflow-auto max-h-[300px] md:max-h-[400px]">
                        {filteredData.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((value, index) => (
                            <div key={index} className="grid grid-cols-12 rounded-xl dark:hover:bg-zinc-950/50 hover:bg-zinc-100 *:px-3 *:py-3 transition-all duration-300">
                                <div className="col-span-3 hidden md:flex items-center text-xs md:text-sm gap-2">
                                    <input type="checkbox" checked={selectedData.includes(value['id_akun'])} onChange={() => handleSelectedData(value['id_akun'])} />
                                    <div className="">
                                        {value['nama_akun']}
                                        <p className="text-xs opacity-50">
                                            {value['nickname_akun']}
                                        </p>
                                    </div>
                                    
                                </div>
                                <div className="col-span-7 md:col-span-3 flex items-center text-xs md:text-sm opacity-100 md:opacity-60">
                                    {value['email_akun']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center text-xs md:text-sm opacity-100">
                                    {value['password_akun']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center text-xs md:text-sm opacity-100 md:opacity-60">
                                    {value['role_akun']}
                                </div>
                                <div className="col-span-5 md:col-span-2 flex items-center text-xs md:text-sm justify-center gap-2">
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
                                                        Nickname
                                                    </p>
                                                    <p className="w-full md:w-3/5">
                                                        {value['nickname_akun']}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="opacity-70 w-full md:w-2/5">
                                                        Email
                                                    </p>
                                                    <p className="w-full md:w-3/5">
                                                        {value['email_akun']}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="opacity-70 w-full md:w-2/5">
                                                        Password
                                                    </p>
                                                    <p className="w-full md:w-3/5">
                                                        {value['password_akun']}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="opacity-70 w-full md:w-2/5">
                                                        Nama
                                                    </p>
                                                    <p className="w-full md:w-3/5">
                                                        {value['nama_akun']}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="opacity-70 w-full md:w-2/5">
                                                        Role
                                                    </p>
                                                    <p className="w-full md:w-3/5">
                                                        {value['role_akun']}
                                                    </p>
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
                                            <form onSubmit={e => submitUbahAkun(e, `ubah_akun_${index}`, value['id_akun'])} className="space-y-2">
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="opacity-70 w-full md:w-2/5">
                                                        Nickname
                                                    </p>
                                                    <input type="text" defaultValue={value['nickname_akun']} required className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700" placeholder="Masukkan Nickname" />
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="opacity-70 w-full md:w-2/5">
                                                        Password
                                                    </p>
                                                    <input type="text" required defaultValue={value['password_akun']} className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700" placeholder="Masukkan Password" />
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="opacity-70 w-full md:w-2/5">
                                                        Role
                                                    </p>
                                                    <select required defaultValue={value['role_akun']} className="w-full md:w-3/5 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-700 cursor-pointer">
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
                                    <button type="button" onClick={() => handleDeleteAkun(value['id_akun'])} className="w-6 h-6 rounded bg-red-500 hover:bg-red-400 focus:bg-red-600 flex items-center justify-center text-white">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex justify-between px-3 py-4 flex-col md:flex-row gap-1">
                    <div className="flex items-center gap-5 justify-between md:justify-start">
                        <p className="text-xs md:text-lg">
                            <b>{selectedData.length}</b> <span className="opacity-70">Data dipilih</span>
                        </p>
                        <div className={`${selectedData.length > 0 ? 'flex' : 'hidden'} items-center gap-2`}>
                            <button type="button" onClick={() => handleDeleteAkun()} className="w-6 h-6 rounded dark:bg-zinc-800 bg-zinc-100 flex items-center justify-center group">
                                <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit opacity-60 group-hover:opacity-100" />
                            </button>
                            <button type="button" onClick={() => handleSelectedData([])} className="w-6 h-6 rounded dark:bg-zinc-800 bg-zinc-100 flex items-center justify-center group">
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