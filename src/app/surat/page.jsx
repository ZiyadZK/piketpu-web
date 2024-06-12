'use client'

import MainLayoutPage from "@/components/mainLayout"
import { date_getDay, date_getMonth, date_getTime, date_getYear } from "@/libs/functions/date"
import { swalToast } from "@/libs/functions/toast"
import { getLoggedUserdata } from "@/libs/functions/userdata"
import { M_Siswa_getAll } from "@/libs/services/M_Siswa"
import { M_Surat_create, M_Surat_delete, M_Surat_getAll, M_Surat_update } from "@/libs/services/M_Surat"
import { faCalendar, faClock, faEdit, faFile, faSave } from "@fortawesome/free-regular-svg-icons"
import { faEllipsisH, faPlus, faPrint, faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import { nanoid } from "nanoid"
import Image from "next/image"
import { createRef, useEffect, useRef, useState } from "react"
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
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [selectedData, setSelectedData] = useState([])
    const [loadingFetch, setLoadingFetch] = useState('')
    const [loggedAkun, setLoggedAkun] = useState({})
    const [selectAllData, setSelectAllData] = useState(false)
    const [filterData, setFilterData] = useState({
        kelas: [], jurusan: [], rombel: []
    })
    const [renderProcess, setRenderProcess] = useState('')

    const [searchSiswa, setSearchSiswa] = useState('')
    const [searchPiket, setSearchPiket] = useState('')
    const [searchDataSiswa, setSearchDataSiswa] = useState('')

    const [selectedSiswa, setSelectedSiswa] = useState([])

    const [printedData, setPrintedData] = useState([])
    const componentPDF = useRef([])

    const submitFormTambah = async (e, modal) => {
        e.preventDefault();
    
        const jsonBody = selectedSiswa.map(state => {
          return {
            id_surat_izin: nanoid(10),
            ...state,
            tanggal: `${date_getYear()}-${date_getMonth()}-${date_getDay()}`,
            waktu: `${date_getTime('hour')}:${date_getTime('minutes')}`,
            tipe: e.target[0].value,
            alasan: e.target[1].value,
            keterangan: e.target[2].value,
            id_guru_piket: loggedAkun['id_guru_piket_akun'],
            nama_guru_piket: loggedAkun['nama_akun']
          };
        });

        if (componentPDF.current.length !== jsonBody.length) {
            componentPDF.current = jsonBody
              .map((_, i) => componentPDF.current[i] || createRef());
          }
    
        setPrintedData(jsonBody);
        setRenderProcess('loading')
    
        // Wait for the DOM to render the new elements
        setTimeout(async () => {
            setRenderProcess('done')
            document.getElementById(modal).close();
        
            const result = await Swal.fire({
                title: 'Apakah anda yakin?',
                text: 'Anda akan membuat surat tersebut!',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya',
                cancelButtonText: 'Tidak',
                allowOutsideClick: false,
            });
        
            if (result.isConfirmed) {
                Swal.fire({
                title: 'Sedang memproses data',
                timer: 60000,
                showConfirmButton: false,
                allowOutsideClick: false,
                timerProgressBar: true,
                didOpen: async () => {
                    const response = await M_Surat_create(jsonBody);
                    if (response.success) {
                        const pdf = new jsPDF({
                            orientation: 'p',
                            unit: 'mm',
                            format: [297, 160],
                            compress: true,
                            precision: 2
                        });
            
                        for (let i = 0; i < componentPDF.current.length; i++) {
                            const content = componentPDF.current[i].current;
                            if (!content) continue;
            
                            const canvas = await html2canvas(content, { scale: 3 });
                            const imgData = canvas.toDataURL('image/jpeg', 1);
            
                            const pdfW = pdf.internal.pageSize.getWidth();
                            const pdfH = pdf.internal.pageSize.getHeight();
            
                            const imgW = canvas.width;
                            const imgH = canvas.height;
            
                            // Calculate scaling factor to fit the image into the PDF page
                            const ratio = Math.min(pdfW / imgW, pdfH / imgH);
            
                            // Calculate the dimensions and position of the image to be centered on the PDF page
                            const imgWidth = imgW * ratio;
                            const imgHeight = imgH * ratio;
                            const imgX = (pdfW - imgWidth) / 2;
                            const imgY = (pdfH - imgHeight) / 2;
            
                            // Add the image to the PDF
                            pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
                            if (i < componentPDF.current.length - 1) {
                                pdf.addPage();
                            }
                        }
            
                        pdf.save(`Surat Piket - ${jsonBody.length} Siswa - ${date_getDay()} ${date_getMonth('string')} ${date_getYear()}`);
                        const pdfDataUri = pdf.output('datauristring');
            
                        document.getElementById(modal).close();
                        setSelectedSiswa([]);
                        setSelectedData([]);
                        await getData();
                        Swal.fire({
                            title: 'Sukses',
                            text: "Berhasil membuat surat tersebut!",
                            icon: 'success',
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: async () => {
                                setPrintedData([])
                                const newTab = window.open();
                                newTab.document.write(`<iframe src="${pdfDataUri}" width="100%" height="100%"></iframe>`);
                            }
                        });
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'Gagal menambahkan surat baru, terdapat Error!',
                            icon: 'error',
                            timer: 5000,
                            timerProgressBar: true
                        }).then(() => {
                            document.getElementById(modal).showModal();
                        });
                    }
                }
                });
            } else {
                setPrintedData([])
                document.getElementById(modal).showModal();
            }
        }, 1000); // Adjust the timeout as needed to ensure the DOM is rendered
    };

    const getData = async () => {
        setLoadingFetch('loading')
        const response = await M_Surat_getAll()

        if(response.success) {
            setData(response.data)
            setFilteredData(response.data)
        }
        setLoadingFetch('fetched')
    }

    const getDataSiswa = async () => {
        const response = await M_Siswa_getAll()
        if(response.success) {
            setDataSiswa(response.data)
            setFilteredDataSiswa(response.data)
        }
    }

    const getLoggedAkun = async () => {
        const response = await getLoggedUserdata()
        if(response.success) {
            setLoggedAkun(response.data)
        }
    }

    useEffect(() => {
        getData()
        getDataSiswa()
        getLoggedAkun()
    }, [])

    const selectSiswa = (siswa) => {
        const isExist = selectedSiswa.some(value => value['nis_siswa'] == siswa['nis'])
        if(isExist) {
            return setSelectedSiswa(state => state.filter(value => value['nis_siswa'] !== siswa['nis']))
        }else{
            return setSelectedSiswa(state => [...state, {
                nis_siswa: siswa['nis'],
                nama_siswa: siswa['nama_siswa'],
                kelas: siswa['kelas'],
                jurusan: siswa['rombel'],
                rombel: siswa['no_rombel']
            }])
        }
    }

    const submitFormEdit = (e, modal, id_surat_izin) => {
        e.preventDefault()

        const payload = {
            tanggal: e.target[0].value.split('T')[0],
            waktu: e.target[0].value.split('T')[1],
            tipe: e.target[1].value,
            alasan: e.target[2].value,
            keterangan: e.target[3].value
        }

        document.getElementById(modal).close()

        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda akan merubah data surat tersebut!',
            icon: 'question',
            timer: 10000,
            timerProgressBar: true,
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak',
            allowOutsideClick: false
        }).then((answer) => {
            if(answer.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    timer: 60000,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    allowEnterKey: false,
                    allowEscapeKey: false,
                    didOpen: async () => {
                        const response = await M_Surat_update(id_surat_izin, payload)

                        if(response.success) {
                            await getData()
                            return swalToast.fire({
                                title: 'Sukses',
                                text: 'Berhasil mengubah data surat tersebut',
                                icon: 'success'
                            })
                        }else{
                            return Swal.fire({
                                title: 'Error',
                                text: 'Gagal mengubah data surat tersebut, terdapat Error',
                                icon: 'error',
                                timer: 5000,
                                timerProgressBar: true
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

    const submitDeleteData = async (id_surat_izin) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: `Anda akan menghapus surat ${!id_surat_izin ? 'yang sudah dipilih' : 'tersebut'}?`,
            icon: 'question',
            timer: 5000,
            timerProgressBar: true,
            showCancelButton: true,
            cancelButtonText: 'Tidak',
            confirmButtonText: 'Ya'
        }).then(answer => {
            if(answer.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    timer: 60000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEnterKey: false,
                    allowEscapeKey: false,
                    didOpen: async () => {
                        const response = await M_Surat_delete(id_surat_izin ? id_surat_izin : selectedData)

                        if(response.success) {
                            await getData()
                            setSelectedData([])
                            setSelectAllData(false)
                            return swalToast.fire({
                                title: 'Sukses',
                                text: 'Berhasil menghapus data tersebut!',
                                icon: 'success',
                                timer: 5000,
                                timerProgressBar: true
                            })
                        }else{
                            return Swal.fire({
                                title: 'Error',
                                text: 'Gagal menghapus data tersebut, terdapat Error!',
                                icon: 'error',
                                timer: 5000,
                                timerProgressBar: true
                            })
                        }
                    }
                })
            }
        })
    }

    const selectData = async (id_surat_izin) => {
        setSelectedData(state => {
            let updatedData
            if(state.includes(id_surat_izin)) {
                updatedData = state.filter(value => value !== id_surat_izin)
            }else{
                updatedData = [...state, id_surat_izin]
            }
            setSelectAllData(updatedData.length === filteredData.length)
            return updatedData
        })
    }

    const handleSelectAllData = async () => {
        if(selectAllData) {
            setSelectedData([])
            setSelectAllData(false)
        }else{
            setSelectedData(filteredData.map(value => value['id_surat_izin']))
            setSelectAllData(true)
        }
    }

    useEffect(() => {
        let updatedData = data

        // Search
        if(searchSiswa !== '') {
            updatedData = updatedData.filter(value => 
                value['nama_siswa'].toLowerCase().includes(searchSiswa.toLowerCase()) ||
                value['nis_siswa'].toLowerCase().includes(searchSiswa.toLowerCase())
            )
        }

        if(searchPiket !== '') {
            updatedData = updatedData.filter(value => 
                value['nama_guru_piket'].toLowerCase().includes(searchPiket.toLowerCase())
            )
        }

        // Filter
        if(filterData['jurusan'].length > 0) {
            updatedData = updatedData.filter(value => 
                filterData['jurusan'].includes(value['jurusan'])
            )
        }

        if(filterData['kelas'].length > 0) {
            updatedData = updatedData.filter(value => 
                filterData['kelas'].includes(value['kelas'])
            )
        }

        if(filterData['rombel'].length > 0) {
            updatedData = updatedData.filter(value => 
                filterData['rombel'].includes(value['rombel'])
            )
        }

        setFilteredData(updatedData)

    }, [filterData, searchSiswa, searchPiket])

    const handleFilterData = (key, value) => {
        setFilterData(state => {
            let updatedState 
            let updatedFilter
            if(state[key].includes(value)){
                updatedFilter = state[key].filter(v => v !== value)
                updatedState = {...state, [key]: updatedFilter}
            }else{
                updatedState = {...state, [key]: [...state[key], value]}
            }
            return updatedState
        })
    }

    const printPrintedData = () => {
        console.log(componentPDF)
    }

    useEffect(() => {
        let updatedData = dataSiswa
        if(searchDataSiswa !== '') {
            updatedData = updatedData.filter(value => 
                value['nama_siswa'].toLowerCase().includes(searchDataSiswa.toLowerCase()) ||
                value['nis'].toLowerCase().includes(searchDataSiswa.toLowerCase()) ||
                value['nisn'].toLowerCase().includes(searchDataSiswa.toLowerCase()) ||
                value['nik'].toLowerCase().includes(searchDataSiswa.toLowerCase())
            )
        }
        setFilteredDataSiswa(updatedData)
    }, [searchDataSiswa])

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
                            <button key={index} type="button" onClick={() => handleFilterData('kelas', value)} className={`px-3 py-2 rounded ${filterData['kelas'].includes(value) ? 'dark:text-zinc-white dark:bg-zinc-800 bg-zinc-100' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-white'}  `}>
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
                            <button key={index} type="button" onClick={() => handleFilterData('jurusan', value)} className={`px-3 py-2 rounded ${filterData['jurusan'].includes(value) ? 'dark:text-zinc-white dark:bg-zinc-800 bg-zinc-100' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-white'}  `}>
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
                            <button key={index} type="button" onClick={() => handleFilterData('rombel', value)} className={`px-3 py-2 rounded ${filterData['rombel'].includes(value) ? 'dark:text-zinc-white dark:bg-zinc-800 bg-zinc-100' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-white'}  `}>
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
                            <input type="text" value={searchSiswa} onChange={e => setSearchSiswa(e.target.value)} className="w-full md:w-1/2 px-3 py-2 rounded border dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" placeholder="NIS / Nama / NISN / NIK" />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 md:items-center">
                        <p className="w-full md:w-1/6 opacity-70">
                            Cari Piket
                        </p>
                        <div className="w-full md:w-5/6 flex items-center gap-4">
                            <input type="text" value={searchPiket} onChange={e => setSearchPiket(e.target.value)} className="w-full md:w-1/2 px-3 py-2 rounded border dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" placeholder="NIK / Nama / NIP" />
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
                        {renderProcess !== 'loading' && (
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                        )}
                        {renderProcess === 'loading' && (
                            <form method="dialog">
                                <div className="loading loading-spinner absolute right-2 top-2 loading-md text-zinc-500"></div>
                            </form>
                        )}
                        <h3 className="font-bold text-lg">Buat Surat Baru</h3>
                        <hr className="my-3 opacity-0" />
                        <div className="flex md:items-center flex-col md:flex-row gap-1">
                            <p className="w-full md:w-2/5 opacity-70">
                                Pilih Siswa
                            </p>
                            <input type="text" value={searchDataSiswa} onChange={e => setSearchDataSiswa(e.target.value)} className="w-full md:w-3/5 px-3 py-1 rounded border dark:bg-transparent dark:border-zinc-700 dark:hover:border-zinc-400 dark:focus:border-zinc-400 dark:outline-none" placeholder="Cari disini" />
                        </div>
                        <hr className="my-1 opacity-0" />
                        <div className="space-y-2 relative overflow-auto w-full max-h-[300px]">
                            {filteredDataSiswa.slice(0, 20).map((value, index) => (
                                <button key={index} type="button" onClick={() => selectSiswa(value)} className={`w-full p-3 rounded-lg border text-start flex items-center justify-between ${!selectedSiswa.some(v => v['nis_siswa'] === value['nis']) ? 'hover:border-zinc-100/0 hover:bg-zinc-100 dark:border-zinc-500 dark:hover:bg-zinc-700' : ' dark:border-zinc-500 bg-zinc-100 dark:bg-zinc-700'} transition-all duration-150`}>
                                    <div className="space-y-1 text-xs md:text-sm">
                                        <p className="font-bold">
                                            {value['nama_siswa']}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs">
                                            <p>{value['nis']}</p>
                                            -
                                            <p>{value['nisn']}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm">
                                        {value['kelas']} {value['rombel']} {value['no_rombel']}
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
                                <p>{selectedSiswa.length} Siswa</p>
                                {selectedSiswa.length > 0 && (
                                    <button type="button" onClick={() => document.getElementById('info_siswa').showModal()} className="flex items-center gap-3 w-fit px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs dark:text-zinc-700 dark:hover:bg-zinc-200">
                                        <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit" />
                                        Cek Siswa
                                    </button>
                                )}
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
                                            {selectedSiswa.slice().reverse().map((value, index) => (
                                                <div key={index} className="grid grid-cols-12 *:px-3 *:py-2">
                                                    <div className="col-span-7">
                                                        <p>
                                                            {value['nama_siswa']}
                                                        </p>
                                                        <p className="opacity-50">
                                                            {value['nis_siswa']}
                                                        </p>
                                                    </div>
                                                    <div className="col-span-5 flex items-center justify-between">
                                                        <p className="px-2 py-1 rounded-full bg-zinc-100 w-fit font-semibold text-xs dark:bg-white/10">
                                                            {value['kelas']} {value['jurusan']} {value['rombel']}
                                                        </p>
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
                            {selectedSiswa.length > 0 && (
                                <>
                                    {renderProcess === 'loading' && (
                                        <div className="loading loading-spinner loading-md text-zinc-500"></div>
                                    )}            
                                    {renderProcess !== 'loading' && (
                                        <button type="submit" className="px-3 py-2 w-full md:w-fit rounded-lg bg-green-600 hover:bg-green-500 focus:bg-green-700 text-white flex items-center justify-center gap-3">
                                            <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                                            Simpan
                                        </button> 
                                    )}
                                </>
                            )}
                        </form>
                    </div>
                </dialog>
                <hr className="my-3 opacity-0" />
                <div className="grid grid-cols-12 border rounded-xl dark:border-zinc-700 dark:bg-zinc-800 dark:text-white *:px-3 *:py-3">
                    <div className="col-span-7 md:col-span-3 flex items-center gap-3">
                        <input type="checkbox" checked={selectAllData} onChange={() => handleSelectAllData()} />
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
                    {filteredData.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((value, index) => (
                        <div key={index} className="grid grid-cols-12 hover:bg-zinc-50/50 dark:hover:bg-zinc-950 w-full *:px-3 *:py-4 rounded">
                            <div className="col-span-7 md:col-span-3 flex gap-3">
                                <input type="checkbox" checked={selectedData.includes(value['id_surat_izin'])} onChange={() => selectData(value['id_surat_izin'])} />
                                <div className="">
                                    <div className="hidden md:flex items-center gap-2 font-medium">
                                        <div className="flex items-center gap-2 text-xs rounded-full px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-500">
                                            <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 text-inherit" />
                                            {date_getDay(value['tanggal'])} {date_getMonth('string', value['tanggal'])} {date_getYear(value['tanggal'])}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs rounded-full px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-500">
                                            <FontAwesomeIcon icon={faClock} className="w-3 h-3 text-inherit" />
                                            {value['waktu']}
                                        </div>
                                    </div>
                                    <hr className=" my-1 opacity-0 hidden md:block" />
                                    <a href={`https://simak.smkpunegerijabar.sch.id/data/siswa/nis/${value['nis_siswa']}`} target="_blank" className="hover:underline text-xs md:text-sm">
                                        {value['nama_siswa']}
                                    </a>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center gap-3 opacity-60 text-xs md:text-sm">
                                {value['kelas']} {value['jurusan']} {value['rombel']}
                            </div> 
                            <div className="col-span-2 hidden md:flex items-center gap-3 text-xs md:text-sm">
                                <div className="space-y-1">
                                    {value['tipe'] === 'Mengikuti Pelajaran' && (
                                        <p className="text-xs px-2 py-1 rounded-full bg-green-500 dark:bg-green-500/10 dark:text-green-500 text-white font-medium">
                                            Mengikuti Pelajaran
                                        </p>
                                    )}
                                    {value['tipe'] === 'Meninggalkan Pelajaran Sementara' && (
                                        <p className="text-xs px-2 py-1 rounded-full bg-blue-500 dark:bg-blue-500/10 dark:text-blue-500 text-white font-medium">
                                            Meninggalkan Pelajaran
                                        </p>
                                    )}
                                    {value['tipe'] === 'Meninggalkan Pelajaran' && (
                                        <p className="text-xs px-2 py-1 rounded-full bg-red-500 dark:bg-red-500/10 dark:text-red-500 text-white font-medium">
                                            Meninggalkan Pelajaran
                                        </p>
                                    )}
                                    <p>
                                        {value['alasan']}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3 opacity-60 text-xs md:text-sm">
                                {value['keterangan']}
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3 text-xs md:text-sm">
                                <a href={`https://simak.smkpunegerijabar.sch.id/data/pegawai/${value['id_guru_piket']}`} className="hover:underline">
                                    {value['nama_guru_piket']}
                                </a>
                            </div>
                            <div className="col-span-5 md:col-span-2 flex items-center justify-center md:gap-2 gap-1">
                                <button type="button" onClick={() => printPrintedData()} className="w-6 h-6 rounded bg-cyan-600 hover:bg-cyan-500 focus:bg-cyan-700 text-white flex items-center justify-center">
                                    <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                                </button>
                                <button type="button" onClick={() => document.getElementById(`info_modal_${index}`).showModal()} className="w-6 h-6 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-700 text-white flex md:hidden items-center justify-center">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                </button>
                                <dialog id={`info_modal_${index}`} className="modal md:hidden">
                                    <div className="modal-box dark:bg-zinc-800">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                        </form>
                                        <h3 className="font-bold text-lg">Informasi Surat</h3>
                                        <hr className="my-2 opacity-0" />
                                        <div className="space-y-3">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs opacity-50">
                                                    Nama
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {value['nama_siswa']}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs opacity-50">
                                                    Tanggal, Waktu
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {date_getDay(value['tanggal'])} {date_getMonth('string', value['tanggal'])} {date_getYear(value['tanggal'])}, {value['waktu']}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs opacity-50">
                                                    Tipe
                                                </p>
                                                {value['tipe'] === 'Mengikuti Pelajaran' && (
                                                    <p className="text-xs px-2 py-1 rounded-full bg-green-500 dark:bg-green-500/10 dark:text-green-500 text-white font-medium w-fit">
                                                        Mengikuti Pelajaran
                                                    </p>
                                                )}
                                                {value['tipe'] === 'Meninggalkan Pelajaran Sementara' && (
                                                    <p className="text-xs px-2 py-1 rounded-full bg-blue-500 dark:bg-blue-500/10 dark:text-blue-500 text-white font-medium w-fit">
                                                        Meninggalkan Pelajaran
                                                    </p>
                                                )}
                                                {value['tipe'] === 'Meninggalkan Pelajaran' && (
                                                    <p className="text-xs px-2 py-1 rounded-full bg-red-500 dark:bg-red-500/10 dark:text-red-500 text-white font-medium w-fit">
                                                        Meninggalkan Pelajaran
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs opacity-50">
                                                    Alasan
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {value['alasan']}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs opacity-50">
                                                    Keterangan
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {value['keterangan']}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs opacity-50">
                                                    Guru Piket
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {value['nama_guru_piket']}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </dialog>
                                <button type="button" onClick={() => document.getElementById(`modal_edit_surat_${index}`).showModal()} className="w-6 h-6 rounded bg-amber-600 hover:bg-amber-500 focus:bg-amber-700 text-white flex items-center justify-center">
                                    <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                </button>
                                <dialog id={`modal_edit_surat_${index}`} className="modal">
                                    <div className="modal-box dark:bg-zinc-800">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                        </form>
                                        <h3 className="font-bold text-lg">Edit Surat</h3>
                                        <hr className="my-3 opacity-0" />
                                        <form onSubmit={(e) => submitFormEdit(e, `modal_edit_surat_${index}`, value['id_surat_izin'])} className="space-y-3">
                                            <div className="flex flex-col md:flex-row md:items-center">
                                                <p className="w-full md:w-2/5 opacity-50 text-xs md:text-sm">
                                                    Nama Siswa
                                                </p>
                                                <div className="w-full md:w-3/5 text-xs md:text-sm flex items-center gap-1">
                                                    <p>
                                                        {value['nama_siswa']}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center">
                                                <p className="w-full md:w-2/5 opacity-50 text-xs md:text-sm">
                                                    Kelas
                                                </p>
                                                <div className="w-full md:w-3/5 text-xs md:text-sm flex items-center gap-1">
                                                    <p>
                                                        {value['kelas']} {value['jurusan']} {value['rombel']}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center">
                                                <p className="w-full md:w-2/5 opacity-50 text-xs md:text-sm">
                                                    Guru Piket
                                                </p>
                                                <div className="w-full md:w-3/5 text-xs md:text-sm flex items-center gap-1">
                                                    <p>
                                                    {value['nama_guru_piket']}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center">
                                                <p className="w-full md:w-2/5 opacity-50 text-xs md:text-sm">
                                                    Tanggal & Waktu
                                                </p>
                                                <div className="w-full md:w-3/5 text-xs md:text-sm flex items-center gap-1">
                                                    <input required defaultValue={`${value['tanggal']}T${value['waktu']}`} type="datetime-local" className="w-fit px-3 py-1 rounded border dark:bg-zinc-800 dark:border-zinc-700" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center">
                                                <p className="w-full md:w-2/5 opacity-50 text-xs md:text-sm">
                                                    Tipe
                                                </p>
                                                <div className="w-full md:w-3/5 text-xs md:text-sm flex items-center gap-1">
                                                    <select required defaultValue={value['tipe']} className="w-full px-3 py-1 rounded border dark:bg-transparent dark:border-zinc-700 dark:hover:border-zinc-400 dark:focus:border-zinc-400 dark:outline-none cursor-pointer dark:bg-zinc-800">
                                                        <option value="" disabled>-- Pilih Tipe --</option>
                                                        <option value="Mengikuti Pelajaran">Mengikuti Pelajaran</option>
                                                        <option value="Meninggalkan Pelajaran">Meninggalkan Pelajaran</option>
                                                        <option value="Meninggalkan Pelajaran Sementara">Meninggalkan Pelajaran Sementara</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center">
                                                <p className="w-full md:w-2/5 opacity-50 text-xs md:text-sm">
                                                    Alasan
                                                </p>
                                                <div className="w-full md:w-3/5 text-xs md:text-sm flex items-center gap-1">
                                                    <input required defaultValue={value['alasan']} type="text" className="w-full px-3 py-1 rounded border dark:bg-zinc-800 dark:border-zinc-700" placeholder="Masukkan Alasan" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center">
                                                <p className="w-full md:w-2/5 opacity-50 text-xs md:text-sm">
                                                    Keterangan
                                                </p>
                                                <div className="w-full md:w-3/5 text-xs md:text-sm flex items-center gap-1">
                                                    <input required defaultValue={value['keterangan']} type="text" className="w-full px-3 py-1 rounded border dark:bg-zinc-800 dark:border-zinc-700" placeholder="Masukkan Keterangan" />
                                                </div>
                                            </div>
                                            <button type="submit" className="w-full md:w-fit px-3 py-2 rounded-lg bg-green-600 hover:bg-green-500 flex items-center justify-center gap-3 text-white">
                                                <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                                                Simpan
                                            </button>
                                        </form>
                                    </div>
                                </dialog>
                                <button type="button" onClick={() => submitDeleteData(value['id_surat_izin'])} className="w-6 h-6 rounded bg-red-600 hover:bg-red-500 focus:bg-red-700 text-white flex items-center justify-center">
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
                            <button type="button" onClick={() => submitDeleteData()} className="w-6 h-6 flex items-center justify-center bg-zinc-200 text-zinc-700 rounded hover:bg-zinc-300">
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
            <hr className="my-3 opacity-0" />
            <div id="halaman_print" className="rounded-2xl p-5 border dark:border-zinc-700 dark:bg-zinc-800 dark:text-white bg-zinc-100">
                <h1 className="text-2xl font-semibold ">
                    Halaman Print
                </h1>
                <hr className="my-3 opacity-0" />
                <div className="w-full flex gap-5 flex-wrap">
                    {printedData.map((value, index) => (
                        <div ref={componentPDF.current[index]} key={index} className="w-[219.21px] h-[400.25px] bg-white text-xs dark:text-zinc-700 pr-10" style={{
                            fontSize: '10px'
                        }}>
                            <div className="flex w-full items-center">
                                <Image src={'/logo-sekolah-2.png'} width={20} height={20} alt="Logo Sekolah" />
                                <div className="text-center w-full -space-y-1.5" style={{
                                        fontSize: '6px'
                                    }}>
                                    <div className="font-bold" >
                                        PEMERINTAH DAERAH PROVINSI JAWA BARAT
                                    </div>
                                    <div className="font-bold" >
                                        DINAS PENDIDIKAN
                                    </div>
                                    <div className="font-bold" >
                                        CABANG DINAS PENDIDIKAN WILAYAH VII
                                    </div>
                                    <div className="font-bold" >
                                        SMK PU NEGERI BANDUNG
                                    </div>
                                </div>
                            </div>
                            <hr className="my-3 border-2 border-zinc-700" />
                            <hr className="my-2 opacity-0" />
                            <p className="font-bold">Surat Izin {value['tipe']}</p>
                            <hr className="my-1 opacity-0" />
                            <div className="-space-y-1">
                                <div className="flex items-center gap-1">
                                    <div className="flex justify-between items-center w-2/6">
                                        <p className="font-bold">Nama</p>
                                        <p className="font-bold">:</p>
                                    </div>
                                    <p className="font-semibold w-4/6">
                                        {value['nama_siswa']}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="flex justify-between items-center w-2/6">
                                        <p className="font-bold">Kelas</p>
                                        <p className="font-bold">:</p>
                                    </div>
                                    <p className="font-semibold w-4/6">
                                        {value['kelas']} {value['jurusan']} {value['rombel']}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="flex justify-between items-center w-2/6">
                                        <p className="font-bold">Tanggal</p>
                                        <p className="font-bold">:</p>
                                    </div>
                                    <p className="font-semibold w-4/6">
                                    {date_getDay(value['tanggal'])} {date_getMonth('string', value['tanggal'])} {date_getYear(value['tanggal'])}
                                    </p>
                                </div>
                            </div>
                            <hr className="my-2 opacity-0" />
                            <div className="-space-y-1">
                                <div className="flex items-center gap-1">
                                    <div className="flex justify-between items-center w-2/6">
                                        <p className="font-bold">Waktu</p>
                                        <p className="font-bold">:</p>
                                    </div>
                                    <p className="font-semibold w-4/6">
                                        {value['waktu']}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="flex justify-between items-center w-2/6">
                                        <p className="font-bold">Keterangan</p>
                                        <p className="font-bold">:</p>
                                    </div>
                                    <p className="font-semibold w-4/6">
                                        {value['keterangan']}
                                    </p>
                                </div>
                            </div>
                            <hr className="my-2 opacity-0" />
                            <p className="text-center font-bold">
                                Bandung, {date_getDay()} {date_getMonth('string')} {date_getYear()}
                            </p>
                            <hr className="my-0.5 opacity-0" />
                            <div className="w-full grid grid-cols-2 h-24 border border-zinc-700 divide-zinc-700 divide-x ">
                                <div className="flex flex-col justify-between">
                                    <p className="font-bold text-center -translate-y-1">Guru Kelas</p>
                                    
                                    <p className="font-bold text-center border-t border-zinc-700 text-zinc-700/0 -translate-y-1">
                                        Guru Kelas
                                    </p>
                                </div>
                                <div className="flex flex-col justify-between">
                                <p className="font-bold text-center -translate-y-1">Petugas Piket</p>
                                    <p className="font-bold text-center border-t border-zinc-700 text-zinc-700 -translate-y-1" style={{
                                        fontSize: '6px'
                                    }}>
                                        {loggedAkun.nama_akun}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </MainLayoutPage>
    )
}