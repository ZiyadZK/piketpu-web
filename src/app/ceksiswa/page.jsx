'use client'

import MainLayoutPage from "@/components/mainLayout"
import MainLayoutPublicPage from "@/components/mainLayoutPublic"
import { date_getDay, date_getMonth, date_getYear } from "@/libs/functions/date"
import { M_Kelas_get } from "@/libs/services/M_Kelas"
import { M_Siswa_getAll } from "@/libs/services/M_Siswa"
import { M_Surat_getAll, M_Surat_getAll_nis, M_Surat_getDetail, M_Surat_reset_nis } from "@/libs/services/M_Surat"
import { faCheck, faExclamationTriangle, faRefresh, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

export default function CekSiswaPage() {

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
            }
        }
        setLoadingFetch(state => ({...state, siswa: 'fetched'}))
        setLoadingFetch(state => ({...state, kelas: 'fetched'}))
        setLoadingFetch(state => ({...state, surat: 'fetched'}))
    }

    

    useEffect(() => {
        if(dataSiswa === null) {
            document.getElementById(`cari_siswa`).showModal()
        }
    }, [])

    const submitReset = async () => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda akan mereset riwayat absensi siswa ini',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then((answer) => {
            if(answer.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    showConfirmButton: false,
                    timer: 60000, 
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    allowEnterKey: false,
                    allowEscapeKey: false,
                    didOpen: async () => {
                        const response = await M_Surat_reset_nis(nis)

                        if(response.success) {
                            await getData()
                            Swal.fire({
                                title: 'Sukses',
                                text: response.message,
                                icon: 'success'
                            })
                        }else{
                            Swal.fire({
                                title: 'Gagal',
                                text: response.message,
                                icon: 'success'
                            })
                        }
                    }
                })
            }
        })
    }

    const submitSearch = async (e, modal) => {
        e.preventDefault()

        document.getElementById(modal).close()

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            allowEnterKey: false,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: async () => {
                await getData(e.target[0].value)
            }
        })

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
                {loadingFetch['siswa'] === 'fetched' && (
                    <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-sm sm:text-sm md:text-xs w-full max-w-[900px] shadow-2xl dark:shadow-white/10">
                        {loadingFetch['siswa'] !== 'fetched' && (
                            <>
                                <div className="flex items-center gap-2">
                                    <button type="button" disabled className="px-3 py-2 rounded-md bg-zinc-300 dark:bg-zinc-500 flex items-center justify-center gap-3 w-1/2 md:w-fit animate-pulse">
                                        <FontAwesomeIcon icon={faRefresh} className="w-3 h-3 text-inherit opacity-0" />
                                        <span className="opacity-0">Reset</span>
                                    </button>
                                    <button type="button" disabled className="px-3 py-2 rounded-md bg-zinc-300 dark:bg-zinc-500 flex items-center justify-center gap-3 w-1/2 md:w-fit animate-pulse">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3 text-inherit opacity-0" />
                                        <span className="opacity-0">Peringatkan</span>
                                    </button>
                                </div>
                                <hr className="my-5 dark:opacity-10" />
                            </>
                        )}
                        {loadingFetch['siswa'] === 'fetched' && dataSurat['data_total_semua'].length > 0 && dataSiswa !== null && (
                            <>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => submitReset()} className="px-3 py-2 rounded-md border dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-3 w-1/2 md:w-fit">
                                        <FontAwesomeIcon icon={faRefresh} className="w-3 h-3 text-inherit opacity-50" />
                                        Reset
                                    </button>
                                    <button type="button" className="px-3 py-2 rounded-md border dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-3 w-1/2 md:w-fit">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3 text-inherit opacity-50" />
                                        Peringatkan
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
                                                Total Absensi
                                            </p>
                                            <p className="w-full sm:w-4/5">
                                                0 Absensi
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 py-3">
                                            <p className="w-full sm:w-1/5 opacity-60">
                                                Total Absensi bulan ini
                                            </p>
                                            <p className="w-full sm:w-4/5">
                                                0 Absensi
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
                                                Total Absensi
                                            </p>
                                            <p className="w-full sm:w-4/5">
                                                {dataSurat['data_total_semua'].length} Absensi
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 py-3">
                                            <p className="w-full sm:w-1/5 opacity-60">
                                                Total Absensi bulan ini
                                            </p>
                                            <p className="w-full sm:w-4/5">
                                                {dataSurat['data_total_bulan'].length} Absensi
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 py-3">
                                            <p className="w-full sm:w-1/5 opacity-60">
                                                Awal melakukan Absensi
                                            </p>
                                            <p className="w-full sm:w-4/5">
                                                {date_getDay(dataSurat['data_total_semua'][dataSurat['data_total_semua'].length - 1]['tanggal'])} {date_getMonth('string', dataSurat['data_total_semua'][dataSurat['data_total_semua'].length - 1]['tanggal'])} {date_getYear(dataSurat['data_total_semua'][dataSurat['data_total_semua'].length - 1]['tanggal'])}, {dataSurat['data_total_semua'][dataSurat['data_total_semua'].length - 1]['waktu']}
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 py-3">
                                            <p className="w-full sm:w-1/5 opacity-60">
                                                Terakhir melakukan Absensi
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
                                                {dataSurat['data_total_semua'].filter(value => value['tipe'] === 'Mengikuti Pelajaran').length} Absensi
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                {dataSurat['data_total_bulan'].filter(value => value['tipe'] === 'Mengikuti Pelajaran').length} Absensi
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7 divide-x dark:divide-zinc-700 ">
                                            <div className="col-span-3 flex items-center font-medium p-3 opacity-60">
                                                Meninggalkan Pelajaran
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                {dataSurat['data_total_semua'].filter(value => value['tipe'] === 'Meninggalkan Pelajaran').length} Absensi
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                {dataSurat['data_total_bulan'].filter(value => value['tipe'] === 'Meninggalkan Pelajaran').length} Absensi
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7 divide-x dark:divide-zinc-700 ">
                                            <div className="col-span-3 flex items-center font-medium p-3 opacity-60">
                                                Meninggalkan Pelajaran Sementara
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                {dataSurat['data_total_semua'].filter(value => value['tipe'] === 'Meninggalkan Pelajaran Sementara').length} Absensi
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center p-3">
                                                {dataSurat['data_total_bulan'].filter(value => value['tipe'] === 'Meninggalkan Pelajaran Sementara').length} Absensi
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
                                <div className="relative overflow-auto py-2 max-h-[500px] divide-y dark:divide-zinc-700">
                                    {dataSurat['data_total_semua'].map((value, index) => (
                                        <div key={index} className="w-full p-3  grid grid-cols-12">
                                            <div className="col-span-3 flex items-center">
                                                {date_getDay(value['tanggal'])} {date_getMonth('string', value['tanggal'])} {date_getYear(value['tanggal'])}, {value['waktu']}
                                            </div>
                                            <div className="col-span-3 flex items-center">
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
                                            <div className="col-span-3 flex items-center">
                                                {value['keterangan']}
                                            </div>
                                            <div className="col-span-3 flex items-center">
                                                {value['nama_piket']}
                                            </div>
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