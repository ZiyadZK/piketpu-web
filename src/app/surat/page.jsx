'use client'

import MainLayoutPage from "@/components/mainLayout"
import { Toaster } from "react-hot-toast"

export default function SuratPage() {
    return (
        <MainLayoutPage>
            <Toaster />
            <div className="mt-5 dark:text-zinc-200 text-zinc-700">
                This is Surat Izin page
            </div>
        </MainLayoutPage>
    )
}