'use client'

import MainLayoutPage from "@/components/mainLayout"
import { date_getDay, date_getMonth, date_getTime, date_getYear } from "@/libs/functions/date"
import { faCalendar, faClock, faEdit, faFile, faSave } from "@fortawesome/free-regular-svg-icons"
import { faEllipsisH, faPlus, faPrint, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"

const kelasList = ['X', 'XI', 'XII']
const jurusanList = ['TKJ', 'TITL', 'DPIB', 'TPM', 'TKR', 'GEO']
const rombelList = ['1', '2', '3', '4']

const formatTambahForm = {
    tipe: '', keterangan: '', alasan: '', tanggal: `${date_getYear()}-${date_getMonth()}-${date_getDay()}`, waktu: `${date_getTime('hour')}:${date_getTime('minutes')}`
}

export default function SuratPage() {

    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [dataPegawai, setDataPegawai] = useState([])
    const [filteredDataPegawai, setFilteredDataPegawai] = useState([])
    const [dataSiswa, setDataSiswa] = useState([])
    const [filteredDataSiswa, setFilteredDataSiswa] = useState([])
    const [searchAkun, setSearchAkun] = useState('')
    const [searchPegawai, setSearchPegawai] = useState('')
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [selectedData, setSelectedData] = useState([])

    const [formTambah, setFormTambah] = useState(formatTambahForm)

    const [selectedSiswa, setSelectedSiswa] = useState([])

    const submitFormTambah = (e, modal) => {
        e.preventDefault()

        document.getElementById(modal).close()

        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda akan membuat surat tersebut!',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak',
            allowOutsideClick: false,
        }).then(answer => {
            if(answer.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    timer: 60000,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    timerProgressBar: true,
                    didOpen: async () => {
                        document.getElementById(modal).close()
                        Swal.fire({
                            title: 'Sukses',
                            text: "Berhasil membuat surat tersebut!",
                            icon: 'success',
                            timer: 3000,
                            timerProgressBar: true
                        })
                    }
                })
            }else{
                document.getElementById(modal).showModal()
            }
        })
    }

    return (
        <MainLayoutPage>
            <Toaster />
            <div className="mt-5 dark:text-zinc-200 text-zinc-700">
                <div className="space-y-2 w-full">
                    <div className="flex flex-col md:flex-row gap-1 md:items-center">
                        <p className="w-full md:w-1/6 opacity-70">
                            Pilih Kelas
                        </p>
                        <div className="w-full md:w-5/6 flex items-center gap-4">
                        {kelasList.map((value, index) => (
                            <button key={index} type="button" className="px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white">
                                {value}
                            </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 md:items-center">
                        <p className="w-full md:w-1/6 opacity-70">
                            Pilih Jurusan
                        </p>
                        <div className="w-full md:w-5/6 flex items-center gap-4">
                        {jurusanList.map((value, index) => (
                            <button key={index} type="button" className="px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white">
                                {value}
                            </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 md:items-center">
                        <p className="w-full md:w-1/6 opacity-70">
                            Pilih Rombel
                        </p>
                        <div className="w-full md:w-5/6 flex items-center gap-4">
                        {rombelList.map((value, index) => (
                            <button key={index} type="button" className="px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white">
                                {value}
                            </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 md:items-center">
                        <p className="w-full md:w-1/6 opacity-70">
                            Cari Siswa
                        </p>
                        <div className="w-full md:w-5/6 flex items-center gap-4">
                            <input type="text" className="w-full md:w-1/2 px-3 py-2 rounded border dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" placeholder="NIS / Nama / NISN / NIK" />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 md:items-center">
                        <p className="w-full md:w-1/6 opacity-70">
                            Cari Piket
                        </p>
                        <div className="w-full md:w-5/6 flex items-center gap-4">
                            <input type="text" className="w-full md:w-1/2 px-3 py-2 rounded border dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" placeholder="NIK / Nama / NIP" />
                        </div>
                    </div>
                </div>
                <hr className="my-3 opacity-0" />
                <button type="button" onClick={() => document.getElementById('modal_tambah_surat').showModal()} className="w-full md:w-fit px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 focus:bg-blue-700 dark:bg-zinc-950 dark:hover:bg-black text-white flex items-center justify-center gap-3">
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-inherit" />
                    Buat Surat
                </button>
                <dialog id="modal_tambah_surat" className="modal">
                    <div className="modal-box md:w-full md:max-w-[600px] dark:bg-zinc-800">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Buat Surat Baru</h3>
                        <hr className="my-3 opacity-0" />
                        <div className="flex md:items-center flex-col md:flex-row gap-1">
                            <p className="w-full md:w-2/5 opacity-70">
                                Pilih Siswa
                            </p>
                            <input type="text" className="w-full md:w-3/5 px-3 py-1 rounded border dark:bg-transparent dark:border-zinc-700 dark:hover:border-zinc-400 dark:focus:border-zinc-400 dark:outline-none" placeholder="Cari disini" />
                        </div>
                        <hr className="my-1 opacity-0" />
                        <div className="space-y-2 relative overflow-auto w-full max-h-[300px]">
                            {Array.from({ length: 50 }).map((_, index) => (
                                <button key={index} type="button" className="w-full p-3 rounded-lg border text-start flex items-center justify-between hover:border-zinc-100/0 hover:bg-zinc-100 transition-all duration-300 dark:border-zinc-500 dark:hover:bg-zinc-700">
                                    <div className="space-y-1 text-xs md:text-sm">
                                        <p className="font-bold">Ziyad Jahizh Kartiwa</p>
                                        <div className="flex items-center gap-2 text-xs">
                                            <p>12121212</p>
                                            -
                                            <p>1212121212</p>
                                        </div>
                                    </div>
                                    <p className="text-sm">
                                        XII TKJ 1
                                    </p>
                                </button>
                            ))}
                        </div>
                        <hr className="my-1 opacity-0" />
                        <div className="flex md:items-center flex-col md:flex-row gap-1">
                            <p className="w-full md:w-2/5 opacity-70">
                                Jumlah Siswa
                            </p>
                            <div className="w-full md:w-3/5 flex items-center gap-5">
                                <p>50 Siswa</p>
                                <button type="button" onClick={() => document.getElementById('info_siswa').showModal()} className="flex items-center gap-3 w-fit px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs dark:text-zinc-700 dark:hover:bg-zinc-200">
                                    <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit" />
                                    Cek Siswa
                                </button>
                                <dialog id="info_siswa" className="modal">
                                    <div className="modal-box md:w-full md:max-w-[600px] text-xs md:text-sm dark:bg-zinc-800">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                        </form>
                                        <h3 className="font-bold text-lg">Info Siswa</h3>
                                        <hr className="my-2 opacity-0" />
                                        <div className="grid grid-cols-12 *:px-3 *:py-3 rounded-lg border dark:border-zinc-700">
                                            <p className="col-span-7 opacity-60">
                                                Nama / NIS
                                            </p>
                                            <p className="col-span-5 opacity-60">
                                                Kelas
                                            </p>
                                        </div>
                                        <div className="py-2 relative overflow-auto w-full max-h-[400px] divide-y dark:divide-zinc-700">
                                            {Array.from({ length: 10}).map((_, index) => (
                                                <div key={index} className="grid grid-cols-12 *:px-3 *:py-2">
                                                    <div className="col-span-7">
                                                        <p>
                                                            Ziyad Jahizh Kartiwa
                                                        </p>
                                                        <p className="opacity-50">
                                                            1212121212
                                                        </p>
                                                    </div>
                                                    <div className="col-span-5 flex items-center justify-between">
                                                        <p className="px-2 py-1 rounded-full bg-zinc-100 w-fit font-semibold text-xs dark:bg-white/10">
                                                            XII TKJ 1
                                                        </p>
                                                        <button type="button">
                                                            <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </dialog>
                            </div>
                        </div>
                        <hr className="my-1 opacity-0" />
                        <form onSubmit={e => submitFormTambah(e, 'modal_tambah_surat')}>
                            <div className="flex md:items-center flex-col md:flex-row gap-1">
                                <p className="w-full md:w-2/5 opacity-70">
                                    Tipe
                                </p>
                                <select className="w-full md:w-3/5 px-3 py-1 rounded border dark:bg-transparent dark:border-zinc-700 dark:hover:border-zinc-400 dark:focus:border-zinc-400 dark:outline-none cursor-pointer dark:bg-zinc-800">
                                    <option value="" disabled>-- Pilih Tipe --</option>
                                    <option value="Mengikuti Pelajaran">Mengikuti Pelajaran</option>
                                    <option value="Meninggalkan Pelajaran">Meninggalkan Pelajaran</option>
                                    <option value="Meninggalkan Pelajaran Sementara">Meninggalkan Pelajaran Sementara</option>
                                </select>
                            </div>
                            <hr className="my-1 opacity-0" />
                            <div className="flex md:items-center flex-col md:flex-row gap-1">
                                <p className="w-full md:w-2/5 opacity-70">
                                    Alasan
                                </p>
                                <input type="text" required className="w-full md:w-3/5 px-3 py-1 rounded border dark:bg-transparent dark:border-zinc-700 dark:hover:border-zinc-400 dark:focus:border-zinc-400 dark:outline-none" placeholder="Masukkan alasan disini" />
                            </div>
                            <hr className="my-1 opacity-0" />
                            <div className="flex md:items-center flex-col md:flex-row gap-1">
                                <p className="w-full md:w-2/5 opacity-70">
                                    Keterangan
                                </p>
                                <input type="text" required className="w-full md:w-3/5 px-3 py-1 rounded border dark:bg-transparent dark:border-zinc-700 dark:hover:border-zinc-400 dark:focus:border-zinc-400 dark:outline-none" placeholder="Masukkan keterangan disini" />
                            </div>
                            <hr className="my-1 opacity-0" />
                            <button type="submit" className="px-3 py-2 w-full md:w-fit rounded-lg bg-green-600 hover:bg-green-500 focus:bg-green-700 text-white flex items-center justify-center gap-3">
                                <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                                Simpan
                            </button>
                        </form>
                    </div>
                </dialog>
                <hr className="my-3 opacity-0" />
                <div className="grid grid-cols-12 border rounded-xl dark:border-zinc-700 dark:bg-zinc-800 dark:text-white *:px-3 *:py-3">
                    <div className="col-span-7 md:col-span-3 flex items-center gap-3">
                        <input type="checkbox" name="" id="" />
                        <p className="opacity-60">Nama Siswa</p>
                    </div>
                    <div className="hidden md:flex items-center gap-3 opacity-60">
                        Kelas
                    </div>
                    <div className="col-span-2 hidden md:flex items-center gap-3 opacity-60">
                        Tipe - Alasan
                    </div>
                    <div className="col-span-2 hidden md:flex items-center gap-3 opacity-60">
                        Keterangan
                    </div>
                    <div className="col-span-2 hidden md:flex items-center gap-3 opacity-60">
                        Guru Piket
                    </div>
                    <div className="col-span-5 md:col-span-2 flex items-center justify-center">
                        <FontAwesomeIcon icon={faEllipsisH} className="w-4 h-4 text-inherit" />
                    </div>
                </div>
                <div className="relative w-full overflow-auto max-h-[300px] py-2">
                    {Array.from({ length: 50 }).map((value, index) => (
                        <div className="grid grid-cols-12 hover:bg-zinc-50/50 dark:hover:bg-zinc-950 w-full *:px-3 *:py-4 rounded">
                            <div className="col-span-7 md:col-span-3 flex gap-3">
                                <input type="checkbox" name="" id="" />
                                <div className="">
                                    <div className="hidden md:flex items-center gap-2 font-medium">
                                        <div className="flex items-center gap-2 text-xs rounded-full px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-500">
                                            <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 text-inherit" />
                                            20 November 2023
                                        </div>
                                        <div className="flex items-center gap-2 text-xs rounded-full px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-500">
                                            <FontAwesomeIcon icon={faClock} className="w-3 h-3 text-inherit" />
                                            20:20
                                        </div>
                                    </div>
                                    <hr className=" my-1 opacity-0 hidden md:block" />
                                    <a href="" className="hover:underline text-xs md:text-sm">
                                        Ziyad Jahizh Kartiwa
                                    </a>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center gap-3 opacity-60 text-xs md:text-sm">
                                XII TKJ 2
                            </div> 
                            <div className="col-span-2 hidden md:flex items-center gap-3 text-xs md:text-sm">
                                <div className="space-y-1">
                                    <p className="text-xs px-2 py-1 rounded-full bg-green-500 dark:bg-green-500/10 dark:text-green-500 text-white font-medium">
                                        Mengikuti Pelajaran
                                    </p>
                                    <p>
                                        Terlambat
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3 opacity-60 text-xs md:text-sm">
                                Kena Macet
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3 text-xs md:text-sm">
                                <a href="" className="hover:underline">
                                    ABC ASBDA SDBA WDBWA DWB
                                </a>
                            </div>
                            <div className="col-span-5 md:col-span-2 flex items-center justify-center md:gap-2 gap-1">
                                <button type="button" className="w-6 h-6 rounded bg-cyan-600 hover:bg-cyan-500 focus:bg-cyan-700 text-white flex items-center justify-center">
                                    <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                                </button>
                                <button type="button" className="w-6 h-6 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-700 text-white flex md:hidden items-center justify-center">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                </button>
                                <button type="button" className="w-6 h-6 rounded bg-amber-600 hover:bg-amber-500 focus:bg-amber-700 text-white flex items-center justify-center">
                                    <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                </button>
                                <button type="button" className="w-6 h-6 rounded bg-red-600 hover:bg-red-500 focus:bg-red-700 text-white flex items-center justify-center">
                                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:items-center md:justify-between text-xs md:text-sm my-3">
                    <div className="flex md:items-center gap-2 md:justify-start justify-between">
                        <div className="flex items-center gap-2">
                            <p className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium">
                                {selectedData.length}
                            </p>
                            <p>
                                Data dipilih
                            </p>
                        </div>
                        {selectedData.length > 0 && <div className="flex items-center gap-2">
                            <button type="button" onClick={() => handleDeleteAkun()} className="w-6 h-6 flex items-center justify-center bg-zinc-200 text-zinc-700 rounded hover:bg-zinc-300">
                                <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                            </button>
                            <button type="button" onClick={() => setSelectedData([])} className="w-6 h-6 flex items-center justify-center bg-zinc-200 text-zinc-700 rounded hover:bg-zinc-300">
                                <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                            </button>
                        </div>}
                    </div>
                    <div className="flex items-center justify-between w-full md:w-fit gap-5">
                        <p>{data.length} Data</p>
                        <div className="join">
                            <button className="join-item px-3 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/50" onClick={() => setPagination(state => state > 1 ? state - 1 : state)}>«</button>
                            <button className="join-item px-3 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/50">Page {pagination}</button>
                            <button className="join-item px-3 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/50" onClick={() => setPagination(state => state < Math.ceil(data.length / totalList) ? state + 1 : state)}>»</button>
                        </div>
                        <select value={totalList} onChange={e => setTotalList(e.target.value)} className="w-fit px-3 py-2 rounded hover:bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800  dark:text-zinc-200 cursor-pointer">
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}