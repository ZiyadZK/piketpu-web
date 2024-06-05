'use client'

import MainLayoutPage from "@/components/mainLayout"
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons"
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Toaster } from "react-hot-toast"

const kelasList = ['X', 'XI', 'XII']
const jurusanList = ['TKJ', 'TITL', 'DPIB', 'TPM', 'TKR', 'GEO']
const rombelList = ['1', '2', '3', '4']

export default function SuratPage() {
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
                <div className="grid grid-cols-12 border rounded-xl dark:border-zinc-700 dark:bg-zinc-800 dark:text-white *:px-3 *:py-2">
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
                        <div className="grid grid-cols-12 hover:bg-zinc-100 dark:hover:bg-zinc-950 w-full *:px-3 *:py-4 rounded">
                            <div className="col-span-7 md:col-span-3 flex gap-3">
                                <input type="checkbox" name="" id="" />
                                <div className="">
                                    <div className="hidden md:flex items-center gap-2">
                                        <div className="flex items-center gap-2 text-xs rounded-full px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-500">
                                            <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 text-inherit" />
                                            20 November 2023
                                        </div>
                                        <div className="flex items-center gap-2 text-xs rounded-full px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-500">
                                            <FontAwesomeIcon icon={faClock} className="w-3 h-3 text-inherit" />
                                            20:20
                                        </div>
                                    </div>
                                    <hr className=" my-1 opacity-0" />
                                    <a href="" className="hover:underline">
                                        Ziyad Jahizh Kartiwa
                                    </a>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center gap-3 opacity-60">
                                XII TKJ 2
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
                    ))}
                </div>
            </div>
        </MainLayoutPage>
    )
}