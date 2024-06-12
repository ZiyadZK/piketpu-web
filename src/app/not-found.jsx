'use client'

import MainLayoutPage from "@/components/mainLayout"
import { faArrowLeft, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"

export default function NotFound() {
    const router = useRouter()

    return (
        <MainLayoutPage>
            <div className="w-full h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="w-20 h-20 text-red-600" />
                    <h1 className="font-medium md:text-6xl text-2xl dark:text-white">
                        Halaman Tidak Ditemukan!
                    </h1>
                    <button type="button" onClick={() => router.back()} className="my-3 w-fit px-3 rounded-full py-2 flex items-center justify-center gap-3 md:text-lg hover:text-blue-600 dark:text-zinc-500 dark:hover:text-white hover:gap-5 transition-all duration-150">
                        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3 md:w-5 md:h-5 text-inherit" />
                        Kembali
                    </button>
                </div>
            </div>
        </MainLayoutPage>
    )
}