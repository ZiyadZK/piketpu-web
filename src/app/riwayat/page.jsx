'use client'

import MainLayoutPage from "@/components/mainLayout"
import { M_Riwayat_getAll } from "@/libs/services/M_Riwayat"
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons"
import { faAngleLeft, faAngleRight, faPlus, faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"

export default function RiwayatPage() {

    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [loadingFetch, setLoadingFetch] = useState('')
    const [selectedData, setSelectedData] = useState([])
    const [searchValue, setSearchValue] = useState('')

    const getData = async () => {
        const response = await M_Riwayat_getAll()
        if(response.success) {
            setData(response.data)
            setFilteredData(response.data)
        }
        setLoadingFetch('fetched')
    }
    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        let updatedData = data
        if(searchValue !== '') {
            updatedData = updatedData.filter(value => 
                value['nama_akun'].toLowerCase().includes(searchValue.toLowerCase()) ||
                value['keterangan'].toLowerCase().includes(searchValue.toLowerCase())
            )
        }
        setFilteredData(updatedData)
    }, [searchValue])

    return (
        <MainLayoutPage>
            <div className="mt-5 dark:text-white text-zinc-700 text-xs md:text-sm">
                <div className="grid grid-cols-12 rounded-lg border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 p-4">
                    <div className="hidden md:flex items-center col-span-2 opacity-60">
                        Tanggal
                    </div>
                    <div className="hidden md:flex items-center col-span-2 opacity-60">
                        Waktu
                    </div>
                    <div className="flex items-center col-span-7 md:col-span-2 opacity-60">
                        User
                    </div>
                    <div className="hidden md:flex items-center col-span-2 opacity-60">
                        Aksi
                    </div>
                    <div className="hidden md:flex items-center col-span-2 opacity-60">
                        Keterangan
                    </div>
                    <div className="flex items-center col-span-5 md:col-span-2">
                        <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} className="w-full rounded border dark:border-zinc-700 dark:bg-zinc-700 px-3 py-1" placeholder="Cari disini" />
                    </div>
                </div>
            </div>
            <div className="py-3 relative overflow-auto w-full max-h-[500px] text-xs dark:text-white text-zinc-700">
                {filteredData.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((_, index) => (
                    <div key={index} className="grid grid-cols-12 px-4 py-3">
                        <div className="hidden md:flex items-center col-span-2 ">
                            <div className="flex items-center gap-3 w-fit px-3 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 text-inherit" />
                                20 November 2023
                            </div>
                        </div>
                        <div className="hidden md:flex items-center col-span-2 ">
                            <div className="flex items-center gap-3 w-fit px-3 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <FontAwesomeIcon icon={faClock} className="w-3 h-3 text-inherit" />
                                20:21
                            </div>
                        </div>
                        <div className="flex items-center col-span-7 md:col-span-2 ">
                            Ziyad Jahizh Kartiwa
                        </div>
                        <div className="hidden md:flex items-center col-span-2 ">
                            <div className="flex items-center gap-3 bg-green-500 text-white dark:bg-green-500/10 dark:text-green-400 w-fit px-3 py-2 rounded-full">
                                <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-inherit" />
                                Tambah
                            </div>
                        </div>
                        <div className="hidden md:flex items-center col-span-2 ">
                            Menambahkan 1 data ke dalam Data Surat
                        </div>
                        <div className="flex items-center col-span-5 md:col-span-2 justify-center">
                            <button type="button" className="px-3 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center gap-3 w-fit">
                                <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit" />
                                Lihat Data
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between px-3 py-4 flex-col md:flex-row gap-1 dark:text-white">
                
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
                    <select value={totalList} onChange={e => setTotalList(e.target.value)} className="px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800 outline-none cursor-pointer">
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>
        </MainLayoutPage>
    )
}