'use client'

import MainLayoutPage from "@/components/mainLayout"
import { Toaster } from "react-hot-toast"

const kelasList = ['X', 'XI', 'XII']
const jurusanList = ['TKJ', 'TITL', 'DPIB', 'TPM', 'TKR', 'GEO']
const rombelList = ['1', '2', '3', '4']

export default function SuratPage() {
    return (
        <MainLayoutPage>
            <Toaster />
            <div className="mt-5 dark:text-zinc-200 text-zinc-700">
                <div className="space-y-2">
                    <div className="flex md:items-center w-full flex-col md:flex-row">
                        <div className="w-full md:w-1/6 opacity-70">
                            Kelas
                        </div>
                        <div className="w-full md:w-5/6 relative overflow-auto flex items-center gap-3">
                            {kelasList.map((value, index) => (
                                <button key={index} type="button" className="px-3 py-1 rounded border dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-gradient-to-t dark:from-zinc-800 dark:to-zinc-900">
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex md:items-center w-full flex-col md:flex-row">
                        <div className="w-full md:w-1/6 opacity-70">
                            Jurusan
                        </div>
                        <div className="w-full md:w-5/6 relative overflow-auto flex items-center gap-2">
                            {jurusanList.map((value, index) => (
                                <button key={index} type="button" className="px-3 py-1 rounded border dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-gradient-to-t dark:from-zinc-800 dark:to-zinc-900">
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex md:items-center w-full flex-col md:flex-row">
                        <div className="w-full md:w-1/6 opacity-70">
                            Rombel
                        </div>
                        <div className="w-full md:w-5/6 relative overflow-auto flex items-center gap-2">
                            {rombelList.map((value, index) => (
                                <button key={index} type="button" className="px-3 py-1 rounded border dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-gradient-to-t dark:from-zinc-800 dark:to-zinc-900">
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}