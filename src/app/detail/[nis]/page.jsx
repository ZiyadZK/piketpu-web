'use client'

import MainLayoutPage from "@/components/mainLayout"
import { faExclamationTriangle, faRefresh } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function DetailSiswaPage({ params: { nis }}) {
    return (
        <MainLayoutPage>
            <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-sm sm:text-sm md:text-xs">
                <div className="flex items-center gap-2">
                    <button type="button" className="px-3 py-2 rounded-md border dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-3 w-1/2 md:w-fit">
                        <FontAwesomeIcon icon={faRefresh} className="w-3 h-3 text-inherit opacity-50" />
                        Reset
                    </button>
                    <button type="button" className="px-3 py-2 rounded-md border dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-3 w-1/2 md:w-fit">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3 text-inherit opacity-50" />
                        Peringatkan
                    </button>
                </div>
                <hr className="my-5 dark:opacity-10" />
                <div className="flex flex-col md:flex-row w-full gap-2">
                    <div className="w-full md:w-1/2 px-5 py-2 rounded-md border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
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
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 p-5 rounded-md border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"></div>
                </div>
            </div>
        </MainLayoutPage>
    )
}