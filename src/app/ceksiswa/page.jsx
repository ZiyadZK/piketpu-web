'use client'

import MainLayoutPage from "@/components/mainLayout"
import MainLayoutPublicPage from "@/components/mainLayoutPublic"
import { date_getDay, date_getMonth, date_getYear } from "@/libs/functions/date"
import { M_Kelas_get } from "@/libs/services/M_Kelas"
import { M_Siswa_getAll } from "@/libs/services/M_Siswa"
import { M_Surat_getAll, M_Surat_getAll_nis, M_Surat_getDetail, M_Surat_reset_nis } from "@/libs/services/M_Surat"
import { faCheck, faEllipsisH, faExclamationCircle, faExclamationTriangle, faInfoCircle, faRefresh, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"
import Swal from "sweetalert2"

export default function CekSiswaPage() {
    const router = useRouter()

    const [dataSiswa, setDataSiswa] = useState(null)
    const [dataKelas, setDataKelas] = useState(null)
    const [dataSurat, setDataSurat] = useState({
        data_total_semua: [], data_total_bulan: []
    })
    const [loadingFetch, setLoadingFetch] = useState({
        siswa: '', kelas: '', surat: ''
    })

    const getData = async (nis) => {
        setLoadingFetch(state => ({...state, siswa: 'loading'}))
        const response = await M_Siswa_getAll()
        if(response.success) {
            Swal.close()
            const data = response.data.find(value => value['nis'] === nis)
            if(data) {
                setDataSiswa(data)

                // Ngambil data kelas buat wali kelas dan guru bk
                setLoadingFetch(state => ({...state, kelas: 'loading'}))
                const responseKelas = await M_Kelas_get(data['kelas'], data['jurusan'], data['rombel'])
                if(responseKelas.success) {
                    setDataKelas(responseKelas.data)
                }

                // Ngambil data surat
                setLoadingFetch(state => ({...state, surat: 'loading'}))
                const responseSurat = await M_Surat_getDetail(nis)
                if(responseSurat.success) {
                    setDataSurat(responseSurat.data)
                }
            }else {
                setDataSiswa(null)
                setDataKelas(null)
                setDataSurat({
                    data_total_semua: [], data_total_bulan: []
                })
            }
        }
        setLoadingFetch(state => ({...state, siswa: 'fetched'}))
        setLoadingFetch(state => ({...state, kelas: 'fetched'}))
        setLoadingFetch(state => ({...state, surat: 'fetched'}))
    }

    

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const queryNis = params.get('nis')
        if(queryNis === null) {
            if(dataSiswa === null) {
                document.getElementById(`cari_siswa`).showModal()
            }
        }else{
            getData(queryNis)
        }
    }, [])

    const submitSearch = async (e, modal) => {
        e.preventDefault()

        document.getElementById(modal).close()

        await getData(e.target[0].value)
        e.target[0].value = ''

    }

    return (
        <MainLayoutPublicPage>
            <dialog id="cari_siswa" className="modal bg-gradient-to-t backdrop-blur">
                <div className="modal-box rounded-md border dark:border-zinc-700 dark:bg-zinc-900">
                    {dataSiswa !== null && (
                        <form method="dialog">
                            <button onClick={() => document.getElementById('cari_siswa').showModal()} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                    )}
                    <h3 className="font-bold text-lg">Cari Siswa</h3>
                    <hr className="my-2 opacity-0" />
                    <p className="opacity-80">
                        Untuk mencari data, anda perlu memasukkan NIS Siswa terlebih dahulu.
                    </p>
                    <hr className="my-2 opacity-0" />
                    <form onSubmit={e => submitSearch(e, `cari_siswa`)} className="space-y-2 text-sm">
                        <input type="text" required className="w-full px-2 py-2 rounded-md dark:bg-zinc-800 border dark:border-zinc-700" placeholder="Masukkan NIS disini" />
                        <button type="submit" className="px-3 py-2 rounded-md bg-blue-500 hover:bg-blue-400 focus:bg-blue-600 flex items-center justify-center gap-3 text-white w-full">
                            <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit opacity-70" />
                            Cari Data
                        </button>
                    </form>
                </div>
            </dialog>
            <div className="flex flex-col gap-5 items-center">
                {loadingFetch['siswa'] === '' && dataSiswa === null && (
                    <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-sm sm:text-sm md:text-xs w-full max-w-[900px] shadow-2xl dark:shadow-white/10">
                        <button type="button" onClick={() => document.getElementById('cari_siswa').showModal()} className="px-3 py-2 rounded-md border dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 ease-out duration-200 flex items-center justify-center gap-3">
                            <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit opacity-50" />
                            Cari Siswa
                        </button>
                        <hr className="my-5 dark:opacity-10" />
                        <p>
                            Anda perlu mencari dan memasukkan NIS Siswa terlebih dahulu untuk melihat detail dari siswa tersebut.
                        </p>
                    </div>
                )}
                {loadingFetch['siswa'] === 'loading' && (
                    <div className="py-5 loading loading-sm loading-spinner opacity-50"></div>
                )}
                {loadingFetch['siswa'] === 'fetched' && (
                    <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-sm sm:text-sm md:text-xs w-full max-w-[900px] shadow-2xl dark:shadow-white/10">
                        <button type="button" onClick={() => document.getElementById('cari_siswa').showModal()} className="px-3 py-2 rounded-md border dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 ease-out duration-200 flex items-center justify-center gap-3">
                            <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit opacity-50" />
                            Cari Siswa lain
                        </button>
                        <hr className="my-5 dark:opacity-10" />
                        {loadingFetch['siswa'] !== 'fetched' && (
                            <>
                                <div className="flex items-center gap-2">
                                    <button type="button" disabled className="px-3 py-2 rounded-md bg-zinc-300 dark:bg-zinc-500 flex items-center justify-center gap-3 w-1/2 md:w-fit animate-pulse">
                                        <FontAwesomeIcon icon={faRefresh} className="w-3 h-3 text-inherit opacity-0" />
                                        <span className="opacity-0">Reset</span>
                                    </button>
                                </div>
                                <hr className="my-5 dark:opacity-10" />
                            </>
                        )}
                        {loadingFetch['siswa'] === 'fetched' && dataSurat['data_total_semua'].length > 0 && dataSiswa !== null && (
                            <>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => router.push(`/detail/${dataSiswa.nis}`)} className="px-3 py-2 rounded-md border dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-3 w-1/2 md:w-fit">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3 text-inherit opacity-50" />
                                        Detail Khusus
                                    </button>
                                </div>
                                <hr className="my-5 dark:opacity-10" />
                            </>
                        )}
                        {loadingFetch['siswa'] !== 'fetched' && (
                            <div className="w-full px-5 py-2 rounded-md   bg-zinc-300 dark:bg-zinc-600 *:opacity-0 animate-pulse">
                                <div className="divide-y dark:divide-zinc-700">
                                    <div className="flex flex-col sm:flex-row gap-2 py-3">
                                        <p className="w-full sm:w-1/5 opacity-60">
                                            Nama Siswa
                                        </p>
                                        <p className="w-full sm:w-4/5">
                                            Ziyad Jahizh Kartiwa
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 py-3">
                                        <p className="w-full sm:w-1/5 opacity-60">
                                            Kelas
                                        </p>
                                        <p className="w-full sm:w-4/5">
                                            XII TKJ 1
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 py-3">
                                        <p className="w-full sm:w-1/5 opacity-60">
                                            NIS
                                        </p>
                                        <p className="w-full sm:w-4/5">
                                            2021
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 py-3">
                                        <p className="w-full sm:w-1/5 opacity-60">
                                            NISN
                                        </p>
                                        <p className="w-full sm:w-4/5">
                                            2021
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 py-3">
                                        <p className="w-full sm:w-1/5 opacity-60">
                                            Jenis Kelamin
                                        </p>
                                        <p className="w-full sm:w-4/5">
                                            Laki-laki
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 py-3">
                                        <p className="w-full sm:w-1/5 opacity-60">
                                            Wali Kelas
                                        </p>
                                        <p className="w-full sm:w-4/5">
                                            Ziyad Jahizh Kartiwa
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 py-3">
                                        <p className="w-full sm:w-1/5 opacity-60">
                                            Guru BK
                                        </p>
                                        <p className="w-full sm:w-4/5">
                                            Ziyad Jahizh Kartiwa
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {loadingFetch['siswa'] === 'fetched' && dataSiswa === null && (
                            <div className="w-full flex justify-center items-center gap-3">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3 text-inherit opacity-60" />
                                Siswa dengan NIS tersebut tidak ditemukan
                            </div>
                        )}
                        {loadingFetch['siswa'] === 'fetched' && dataSiswa !== null && (
                            <div className="w-full px-5 py-2 rounded-md border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                                <div className="divide-y dark:divide-zinc-700">
                                    <div className="flex flex-col sm:flex-row gap-2 py-3">
                                        <p className="w-full sm:w-1/5 opacity-60">
                                            Nama Siswa
                                        </p>
                                        <p className="w-full sm:w-4/5">
                                            {dataSiswa['nama_siswa']}
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 py-3">
                                        <p className="w-full sm:w-1/5 opacity-60">
                                            Kelas
                                        </p>
                                        <p className="w-full sm:w-4/5">
                                        {dataSiswa['kelas']} {dataSiswa['jurusan']} {dataSiswa['rombel']}
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 py-3">
                                        <p className="w-full sm:w-1/5 opacity-60">
                                            NIS
                                        </p>
                                        <p className="w-full sm:w-4/5">
                                            {dataSiswa['nis']}
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 py-3">
                                        <p className="w-full sm:w-1/5 opacity-60">
                                            NISN
                                        </p>
                                        <p className="w-full sm:w-4/5">
                                            {dataSiswa['nisn']}
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 py-3">
                                        <p className="w-full sm:w-1/5 opacity-60">
                                            Jenis Kelamin
                                        </p>
                                        <p className="w-full sm:w-4/5">
                                            {dataSiswa['jenis_kelamin']}
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 py-3">
                                        <p className="w-full sm:w-1/5 opacity-60">
                                            Wali Kelas
                                        </p>
                                        <p className="w-full sm:w-4/5">
                                            {dataKelas['nama_wali_kelas'] || '-'}
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 py-3">
                                        <p className="w-full sm:w-1/5 opacity-60">
                                            Guru BK
                                        </p>
                                        <p className="w-full sm:w-4/5">
                                            {dataKelas['nama_gurubk_kelas'] || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {loadingFetch['surat'] !== 'fetched' && (
                            <>
                                <hr className="my-5 dark:opacity-10" />
                                <div className="w-full px-5 py-2 rounded-md bg-zinc-300 dark:bg-zinc-600 *:opacity-0 animate-pulse">
                                    <div className="divide-y dark:divide-zinc-700">
                                        <div className="flex flex-col sm:flex-row gap-2 py-3">
                                            <p className="w-full sm:w-1/5 opacity-60">
                                                Total Izin
                                            </p>
                                            <p className="w-full sm:w-4/5">
                                                0 Izin
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 py-3">
                                            <p className="w-full sm:w-1/5 opacity-60">
                                                Total Izin bulan ini
                                            </p>
                                            <p className="w-full sm:w-4/5">
                                                0 Izin
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 py-3">
                                            <p className="w-full sm:w-1/5 opacity-60">
                                                Awal melakukan Absensi
                                            </p>
                                            <p className="w-full sm:w-4/5">
                                                -, -
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 py-3">
                                            <p className="w-full sm:w-1/5 opacity-60">
                                                Terakhir melakukan Absensi
                                            </p>
                                            <p className="w-full sm:w-4/5">
                                                -, -
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-5 dark:opacity-10" />
                                <div className="w-full p-2 rounded-md bg-zinc-300 dark:bg-zinc-600 *:opacity-0 animate-pulse">
                                    <div className="divide-y dark:divide-zinc-700">
                                        <div className="grid grid-cols-7 divide-x dark:divide-zinc-700 ">
                                            <div className="col-span-3 flex items-center font-medium p-3">
                                                Total
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center font-extrabold p-3">
                                                Keseluruhan
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center font-extrabold p-3">
                                                Bulan Ini
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7 divide-x dark:divide-zinc-700 ">
                                            <div className="col-span-3 flex items-center font-medium p-3 opacity-60">
                                                Mengikuti Pelajaran
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                0 Absensi
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                0 Absensi
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7 divide-x dark:divide-zinc-700 ">
                                            <div className="col-span-3 flex items-center font-medium p-3 opacity-60">
                                                Meninggalkan Pelajaran
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                0 Absensi
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                0 Absensi
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7 divide-x dark:divide-zinc-700 ">
                                            <div className="col-span-3 flex items-center font-medium p-3 opacity-60">
                                                Meninggalkan Pelajaran Sementara
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                0 Absensi
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                0 Absensi
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-5 dark:opacity-10" />
                                <div className="w-full p-3 rounded-md border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 grid grid-cols-12">
                                    <div className="col-span-3 font-medium flex items-center">
                                        Tanggal
                                    </div>
                                    <div className="col-span-3 font-medium flex items-center">
                                        Absensi
                                    </div>
                                    <div className="col-span-3 font-medium flex items-center">
                                        Keterangan
                                    </div>
                                    <div className="col-span-3 font-medium flex items-center">
                                        Guru Piket
                                    </div>
                                </div>
                                <div className="relative overflow-auto py-2 max-h-[500px] divide-y dark:divide-zinc-700 flex justify-center">
                                    <div className="loading loading-spinner loading-sm opacity-50"></div>
                                </div>
                            </>
                        )}
                        {loadingFetch['surat'] === 'fetched' && dataSiswa !== null && dataSurat['data_total_semua'].length < 1 && (
                            <div className="w-full flex justify-center items-center gap-3 pt-5">
                                <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-inherit opacity-60" />
                                Tidak ada riwayat absensi
                            </div>
                        )}
                        {loadingFetch['surat'] === 'fetched' && dataSurat['data_total_semua'].length > 0 && (
                            <>
                                <hr className="my-5 dark:opacity-10" />
                                <div className="w-full px-5 py-2 rounded-md border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                                    <div className="divide-y dark:divide-zinc-700">
                                        <div className="flex flex-col sm:flex-row gap-2 py-3">
                                            <p className="w-full sm:w-1/5 opacity-60">
                                                Total Izin
                                            </p>
                                            <p className="w-full sm:w-4/5">
                                                {dataSurat['data_total_semua'].length} Izin
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 py-3">
                                            <p className="w-full sm:w-1/5 opacity-60">
                                                Total Izin bulan ini
                                            </p>
                                            <p className="w-full sm:w-4/5">
                                                {dataSurat['data_total_bulan'].length} Izin
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 py-3">
                                            <p className="w-full sm:w-1/5 opacity-60">
                                                Awal melakukan Izin
                                            </p>
                                            <p className="w-full sm:w-4/5">
                                                {date_getDay(dataSurat['data_total_semua'][dataSurat['data_total_semua'].length - 1]['tanggal'])} {date_getMonth('string', dataSurat['data_total_semua'][dataSurat['data_total_semua'].length - 1]['tanggal'])} {date_getYear(dataSurat['data_total_semua'][dataSurat['data_total_semua'].length - 1]['tanggal'])}, {dataSurat['data_total_semua'][dataSurat['data_total_semua'].length - 1]['waktu']}
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 py-3">
                                            <p className="w-full sm:w-1/5 opacity-60">
                                                Terakhir melakukan Izin
                                            </p>
                                            <p className="w-full sm:w-4/5">
                                                {date_getDay(dataSurat['data_total_semua'][0]['tanggal'])} {date_getMonth('string', dataSurat['data_total_semua'][0]['tanggal'])} {date_getYear(dataSurat['data_total_semua'][dataSurat['data_total_semua'].length - 1]['tanggal'])}, {dataSurat['data_total_semua'][dataSurat['data_total_semua'].length - 1]['waktu']}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-5 dark:opacity-10" />
                                <div className="w-full p-2 rounded-md border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                                    <div className="divide-y dark:divide-zinc-700">
                                        <div className="grid grid-cols-7 divide-x dark:divide-zinc-700 ">
                                            <div className="col-span-3 flex items-center font-medium p-3">
                                                Total
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center font-extrabold p-3">
                                                Bulan ini
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center font-extrabold p-3">
                                                Semester ini
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7 divide-x dark:divide-zinc-700 ">
                                            <div className="col-span-3 flex items-center font-medium p-3 opacity-60">
                                                Mengikuti Pelajaran
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                {dataSurat['data_total_bulan'].filter(value => value['tipe'] === 'Mengikuti Pelajaran').length} Izin
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                {dataSurat['data_total_semua'].filter(value => value['tipe'] === 'Mengikuti Pelajaran').length} Izin
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7 divide-x dark:divide-zinc-700 ">
                                            <div className="col-span-3 flex items-center font-medium p-3 opacity-60">
                                                Meninggalkan Pelajaran
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                {dataSurat['data_total_bulan'].filter(value => value['tipe'] === 'Meninggalkan Pelajaran').length} Izin
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                {dataSurat['data_total_semua'].filter(value => value['tipe'] === 'Meninggalkan Pelajaran').length} Izin
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7 divide-x dark:divide-zinc-700 ">
                                            <div className="col-span-3 flex items-center font-medium p-3 opacity-60">
                                                Meninggalkan Pelajaran Sementara
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                {dataSurat['data_total_bulan'].filter(value => value['tipe'] === 'Meninggalkan Pelajaran Sementara').length} Izin
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                {dataSurat['data_total_semua'].filter(value => value['tipe'] === 'Meninggalkan Pelajaran Sementara').length} Izin
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-5 dark:opacity-10" />
                                <div className="w-full p-3 rounded-md border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 grid grid-cols-12">
                                    <div className="col-span-3 font-medium hidden md:flex items-center">
                                        Tanggal
                                    </div>
                                    <div className="col-span-8 md:col-span-3 font-medium flex items-center">
                                        Izin
                                    </div>
                                    <div className="col-span-3 font-medium hidden md:flex items-center">
                                        Keterangan
                                    </div>
                                    <div className="col-span-3 font-medium hidden md:flex items-center">
                                        Guru Piket
                                    </div>
                                    <div className="col-span-4 md:hidden flex items-center justify-center">
                                        <FontAwesomeIcon icon={faEllipsisH} className="w-3 h-3 text-inherit" />
                                    </div>
                                </div>
                                <div className="relative overflow-auto py-2 max-h-[500px] divide-y dark:divide-zinc-700">
                                    {dataSurat['data_total_semua'].map((value, index) => (
                                        <div key={index} className="w-full p-3  grid grid-cols-12">
                                            <div className="col-span-3 hidden md:flex items-center">
                                                {date_getDay(value['tanggal'])} {date_getMonth('string', value['tanggal'])} {date_getYear(value['tanggal'])}, {value['waktu']}
                                            </div>
                                            <div className="col-span-8 md:col-span-3 flex items-center">
                                                {value['tipe'] === 'Mengikuti Pelajaran' && (
                                                    <p className="text-xs rounded-full text-green-500 font-medium">
                                                        Mengikuti Pelajaran
                                                    </p>
                                                )}
                                                {value['tipe'] === 'Meninggalkan Pelajaran' && (
                                                    <p className="text-xs rounded-full text-red-500 font-medium">
                                                        Meninggalkan Pelajaran
                                                    </p>
                                                )}
                                                {value['tipe'] === 'Meninggalkan Pelajaran Sementara' && (
                                                    <p className="text-xs rounded-full text-amber-500 font-medium">
                                                        Meninggalkan Pelajaran Sementara
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-span-3 hidden md:flex items-center">
                                                {value['keterangan']}
                                            </div>
                                            <div className="col-span-3 hidden md:flex items-center">
                                                {value['nama_piket']}
                                            </div>
                                            <div className="col-span-4 md:hidden flex items-center justify-center gap-2">
                                                <button type="button" onClick={() => document.getElementById(`info_surat_${value['id_surat_izin']}`).showModal()} className="w-6 h-6 rounded-md border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faInfoCircle} className="w-3 h-3 text-inherit" />
                                                </button>
                                            </div>
                                            <dialog id={`info_surat_${value['id_surat_izin']}`} className="modal backdrop-blur-sm">
                                                <div className="modal-box rounded-md dark:bg-zinc-900 border dark:border-zinc-700">
                                                    <form method="dialog">
                                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                                    </form>
                                                    <h3 className="font-bold text-lg">Informasi Izin</h3>
                                                    <div className="divide-y dark:divide-zinc-700">
                                                        <div className="flex flex-col gap-1 py-3">
                                                            <p className="opacity-60">
                                                                Tanggal & Waktu
                                                            </p>
                                                            <p>
                                                                {date_getDay(value['tanggal'])} {date_getMonth('string', value['tanggal'])} {date_getYear(value['tanggal'])}, {value['waktu']}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col gap-1 py-3">
                                                            <p className="opacity-60">
                                                                Izin
                                                            </p>
                                                            <div className="">
                                                                {value['tipe'] === 'Mengikuti Pelajaran' && (
                                                                    <p className="text-xs rounded-full text-green-500 font-medium">
                                                                        Mengikuti Pelajaran
                                                                    </p>
                                                                )}
                                                                {value['tipe'] === 'Meninggalkan Pelajaran' && (
                                                                    <p className="text-xs rounded-full text-red-500 font-medium">
                                                                        Meninggalkan Pelajaran
                                                                    </p>
                                                                )}
                                                                {value['tipe'] === 'Meninggalkan Pelajaran Sementara' && (
                                                                    <p className="text-xs rounded-full text-amber-500 font-medium">
                                                                        Meninggalkan Pelajaran Sementara
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1 py-3">
                                                            <p className="opacity-60">
                                                                Keterangan
                                                            </p>
                                                            <div className="">
                                                                {value['keterangan']}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1 py-3">
                                                            <p className="opacity-60">
                                                                Guru Piket
                                                            </p>
                                                            <div className="">
                                                                {value['nama_piket']}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </dialog>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        
                    </div>
                )}
            </div>
        </MainLayoutPublicPage>
    )
}