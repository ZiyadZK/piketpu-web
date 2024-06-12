'use client'

import MainLayoutPage from "@/components/mainLayout";
import { animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faUserCheck, faUserTag, faUserXmark, faUsers, faWarning } from "@fortawesome/free-solid-svg-icons";
import { date_getDay, date_getMonth, date_getYear } from "@/libs/functions/date";
import { M_Surat_getAll } from "@/libs/services/M_Surat";

export default function Home() {
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)

  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loadingFetch, setLoadingFetch] = useState('')
  const [filterTanggal, setFilterTanggal] = useState({
    awal: `${date_getYear()}-${date_getMonth()}-${date_getDay()}`, akhir: `${date_getYear()}-${date_getMonth()}-${date_getDay()}`
  })
  const [total, setTotal] = useState({
    'X': 0, 'XI': 0, 'XII': 0, siswa: 0, siswa_mengikuti: 0,  siswa_meninggalkan: 0, siswa_meninggalkan_sementara: 0, siswa_terbanyak: [], kelas_terbanyak: []
  })

  const [pagination, setPagination] = useState({
    siswa: 1, kelas: 1
  })

  useEffect(() => {
    const controls = animate(count, 100, {duration: 15, ease: 'easeInOut'})

    return () => controls.stop()
  }, [])

  const handleFilterTanggal = async (tipe, value) => {
    if(tipe === 'awal') {
      if(new Date(value) > new Date(filterTanggal['akhir'])) {
        return setFilterTanggal(state => ({awal: value, akhir: value}))
      }else{
        return setFilterTanggal(state => ({...state, [tipe]: value}))
      }
    }else{
      if(new Date(value) < new Date(filterTanggal['awal'])) {
        return setFilterTanggal(state => ({awal: value, akhir: value}))
      }else{
        return setFilterTanggal(state => ({...state, [tipe]: value}))
      }
    }
  }

  const getData = async () => {
    const response = await M_Surat_getAll()
    if(response.success) {
      setData(response.data)
      const updatedData = response.data.filter(value => {
        const startDate = new Date(filterTanggal['awal']);
        const endDate = new Date(filterTanggal['akhir']);
        const valueDate = new Date(value['tanggal']);
        return valueDate >= startDate && valueDate <= endDate;
      });

      const X = new Set(response.data.filter(value => value['kelas'] === 'X').map(value => value['nama_siswa']))
      const XI = new Set(response.data.filter(value => value['kelas'] === 'XI').map(value => value['nama_siswa']))
      const XII = new Set(response.data.filter(value => value['kelas'] === 'XII').map(value => value['nama_siswa']))
      const siswa = new Set(response.data.map(value => value['nama_siswa']))
      const siswa_mengikuti = new Set(response.data.filter(value => value['tipe'] === 'Mengikuti Pelajaran').map(value => value['nama_siswa']))
      const siswa_meninggalkan = new Set(response.data.filter(value => value['tipe'] === 'Meninggalkan Pelajaran').map(value => value['nama_siswa']))
      const siswa_meninggalkan_sementara = new Set(response.data.filter(value => value['tipe'] === 'Meninggalkan Pelajaran Sementara').map(value => value['nama_siswa']))
      const kelas_terbanyak = new Set(response.data.map(value => `${value['kelas']} ${value['jurusan']} ${value['rombel']}`))

      const siswaTerbanyak = Array.from(siswa).map(value => {
        const arrSiswa = response.data.filter(v => v['nama_siswa'] === value)

        return {
          nama_siswa: value,
          kelas: `${response.data.find(v => v['nama_siswa'] === value)['kelas']} ${response.data.find(v => v['nama_siswa'] === value)['jurusan']} ${response.data.find(v => v['nama_siswa'] === value)['rombel']}`,
          jumlah_surat: arrSiswa.length
        }
      }).sort((a, b) => b.jumlah_surat - a.jumlah_surat);

      const kelasTerbanyak = Array.from(kelas_terbanyak).map(value => {
        const arrKelas = response.data.filter(v => v['kelas'] === value.split(' ')[0]).filter(v => v['jurusan'] === value.split(' ')[1]).filter(v => v['rombel'] === value.split(' ')[2])

        return {
          kelas: value,
          jumlah_surat: arrKelas.length
        }
      }).sort((a, b) => b.jumlah_surat - a.jumlah_surat);

      setTotal(state => ({
        ...state,
        X: X.size, XI: XI.size, XII: XII.size, siswa: siswa.size, siswa_mengikuti: siswa_mengikuti.size, siswa_meninggalkan: siswa_meninggalkan.size, siswa_meninggalkan_sementara: siswa_meninggalkan_sementara.size,
        kelas_terbanyak: kelasTerbanyak,
        siswa_terbanyak: siswaTerbanyak
      }))
      
      setFilteredData(updatedData)
    }
    setLoadingFetch('fetched')
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if (data.length > 0) {
      const updatedData = data.filter(value => {
        const startDate = new Date(filterTanggal['awal']);
        const endDate = new Date(filterTanggal['akhir']);
        const valueDate = new Date(value['tanggal']);
        return valueDate >= startDate && valueDate <= endDate;
      });

      const X = new Set(updatedData.filter(value => value['kelas'] === 'X').map(value => value['nama_siswa']))
      const XI = new Set(updatedData.filter(value => value['kelas'] === 'XI').map(value => value['nama_siswa']))
      const XII = new Set(updatedData.filter(value => value['kelas'] === 'XII').map(value => value['nama_siswa']))
      const siswa = new Set(updatedData.map(value => value['nama_siswa']))
      const siswa_mengikuti = new Set(updatedData.filter(value => value['tipe'] === 'Mengikuti Pelajaran').map(value => value['nama_siswa']))
      const siswa_meninggalkan = new Set(updatedData.filter(value => value['tipe'] === 'Meninggalkan Pelajaran').map(value => value['nama_siswa']))
      const siswa_meninggalkan_sementara = new Set(updatedData.filter(value => value['tipe'] === 'Meninggalkan Pelajaran Sementara').map(value => value['nama_siswa']))
      const kelas_terbanyak = new Set(updatedData.map(value => `${value['kelas']} ${value['jurusan']} ${value['rombel']}`))

      const siswaTerbanyak = Array.from(siswa).map(value => {
        const arrSiswa = updatedData.filter(v => v['nama_siswa'] === value)

        return {
          nama_siswa: value,
          kelas: `${updatedData.find(v => v['nama_siswa'] === value)['kelas']} ${updatedData.find(v => v['nama_siswa'] === value)['jurusan']} ${updatedData.find(v => v['nama_siswa'] === value)['rombel']}`,
          jumlah_surat: arrSiswa.length
        }
      }).sort((a, b) => b.jumlah_surat - a.jumlah_surat);

      const kelasTerbanyak = Array.from(kelas_terbanyak).map(value => {
        const arrKelas = updatedData.filter(v => v['kelas'] === value.split(' ')[0]).filter(v => v['jurusan'] === value.split(' ')[1]).filter(v => v['rombel'] === value.split(' ')[2])

        return {
          kelas: value,
          jumlah_surat: arrKelas.length
        }
      }).sort((a, b) => b.jumlah_surat - a.jumlah_surat);

      setTotal(state => ({
        ...state,
        X: X.size, XI: XI.size, XII: XII.size, siswa: siswa.size, siswa_mengikuti: siswa_mengikuti.size, siswa_meninggalkan: siswa_meninggalkan.size, siswa_meninggalkan_sementara: siswa_meninggalkan_sementara.size,
        kelas_terbanyak: kelasTerbanyak,
        siswa_terbanyak: siswaTerbanyak
      }))
      
      setFilteredData(updatedData)
    }

  }, [filterTanggal])

  

  return (
    <MainLayoutPage>
      <Toaster />
      {loadingFetch !== 'fetched' && (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="loading loading-spinner loading-lg text-zinc-500"></div>
        </div>
      )}
      {loadingFetch === 'fetched' && data.length < 1 && (
        <div className="w-full h-screen flex flex-col gap-2 items-center justify-center">
          <FontAwesomeIcon icon={faWarning} className="w-16 h-16 text-red-500" />
          <h1 className="font-extrabold text-zinc-500">
            Data Kosong!
          </h1>
        </div>
      )}
      {loadingFetch === 'fetched' && data.length > 0 && (
        <div className="mt-10 dark:text-zinc-200 text-zinc-700">

          <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
            <div className="w-full md:w-1/6">
              Pilih Tanggal
            </div>
            <div className="w-full md:5/6 flex items-center gap-3 text-xs md:text-sm">
              <input type="date" value={filterTanggal['awal']} onChange={e => handleFilterTanggal('awal', e.target.value)} className="px-3 py-1 rounded border dark:border-zinc-700 dark:bg-zinc-800" />
              <p>s/d</p>
              <input type="date" value={filterTanggal['akhir']} onChange={e => handleFilterTanggal('akhir', e.target.value)} className="px-3 py-1 rounded border dark:border-zinc-700 dark:bg-zinc-800" />
            </div>
          </div>

          <hr className="my-3 opacity-0" />

          <div className="grid md:grid-cols-3 gap-5">

            <div className="w-full p-5 rounded shadow hover:shadow-lg transition-all duration-150 dark:border dark:border-zinc-800 bg-gradient-to-t dark:hover:from-zinc-800">
              <div className="flex justify-center w-full">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-amber-500/10 text-amber-500 dark:text-amber-400 font-extrabold text-3xl">
                  X
                </div>
              </div>
              <hr className="my-2 opacity-0" />
              <h1 className="font-extrabold text-4xl text-center text-zinc-500 dark:text-zinc-200">
                {total['X']} Siswa
              </h1>
              <hr className="my-1 opacity-0" />
              <p className="text-center opacity-60 font-extralight">
                Kelas 10
              </p>
            </div>

            <div className="w-full p-5 rounded shadow hover:shadow-lg transition-all duration-150 dark:border dark:border-zinc-800 bg-gradient-to-t dark:hover:from-zinc-800">
              <div className="flex justify-center w-full">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-500/10 text-green-500 dark:text-green-400 font-extrabold text-3xl">
                  XI
                </div>
              </div>
              <hr className="my-2 opacity-0" />
              <h1 className="font-extrabold text-4xl text-center text-zinc-500 dark:text-zinc-200">
              {total['XI']} Siswa
              </h1>
              <hr className="my-1 opacity-0" />
              <p className="text-center opacity-60 font-extralight">
                Kelas 11
              </p>
            </div>

            <div className="w-full p-5 rounded shadow hover:shadow-lg transition-all duration-150 dark:border dark:border-zinc-800 bg-gradient-to-t dark:hover:from-zinc-800">
              <div className="flex justify-center w-full">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-500 dark:text-blue-400 font-extrabold text-3xl">
                  XII
                </div>
              </div>
              <hr className="my-2 opacity-0" />
              <h1 className="font-extrabold text-4xl text-center text-zinc-500 dark:text-zinc-200">
              {total['XII']} Siswa
              </h1>
              <hr className="my-1 opacity-0" />
              <p className="text-center opacity-60 font-extralight">
                Kelas 12
              </p>
            </div>

          </div>    

          <hr className="my-2.5 dark:opacity-20" />

          <div className="grid md:grid-cols-4 gap-5">

            <div className="w-full p-5 rounded shadow hover:shadow-lg transition-all duration-150 dark:border dark:border-zinc-800 bg-gradient-to-t dark:hover:from-zinc-800">
              <div className="flex justify-center w-full">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-amber-500/10 text-amber-500 dark:text-amber-400">
                  <FontAwesomeIcon icon={faUsers} className="w-8 h-8 text-inherit" />
                </div>
              </div>
              <hr className="my-2 opacity-0" />
              <h1 className="font-extrabold text-4xl text-center text-zinc-500 dark:text-zinc-200">
              {total['siswa']} Siswa
              </h1>
              <hr className="my-1 opacity-0" />
              <p className="text-center opacity-60 font-extralight">
                Total
              </p>
            </div>

            <div className="w-full p-5 rounded shadow hover:shadow-lg transition-all duration-150 dark:border dark:border-zinc-800 bg-gradient-to-t dark:hover:from-zinc-800">
              <div className="flex justify-center w-full">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-500/10 text-green-500 dark:text-green-400">
                  <FontAwesomeIcon icon={faUserCheck} className="w-8 h-8 text-inherit" />
                </div>
              </div>
              <hr className="my-2 opacity-0" />
              <h1 className="font-extrabold text-4xl text-center text-zinc-500 dark:text-zinc-200">
              {total['siswa_mengikuti']} Siswa
              </h1>
              <hr className="my-1 opacity-0" />
              <p className="text-center opacity-60 font-extralight">
                Mengikuti Pelajaran
              </p>
            </div>

            <div className="w-full p-5 rounded shadow hover:shadow-lg transition-all duration-150 dark:border dark:border-zinc-800 bg-gradient-to-t dark:hover:from-zinc-800">
              <div className="flex justify-center w-full">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-500 dark:text-blue-400">
                  <FontAwesomeIcon icon={faUserTag} className="w-8 h-8 text-inherit" />
                </div>
              </div>
              <hr className="my-2 opacity-0" />
              <h1 className="font-extrabold text-4xl text-center text-zinc-500 dark:text-zinc-200">
              {total['siswa_meninggalkan_sementara']} Siswa
              </h1>
              <hr className="my-1 opacity-0" />
              <p className="text-center opacity-60 font-extralight">
                Meninggalkan Pelajaran Sementara
              </p>
            </div>
            
            <div className="w-full p-5 rounded shadow hover:shadow-lg transition-all duration-150 dark:border dark:border-zinc-800 bg-gradient-to-t dark:hover:from-zinc-800">
              <div className="flex justify-center w-full">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500/10 text-red-500 dark:text-red-400">
                  <FontAwesomeIcon icon={faUserXmark} className="w-8 h-8 text-inherit" />
                </div>
              </div>
              <hr className="my-2 opacity-0" />
              <h1 className="font-extrabold text-4xl text-center text-zinc-500 dark:text-zinc-200">
              {total['siswa_meninggalkan']} Siswa
              </h1>
              <hr className="my-1 opacity-0" />
              <p className="text-center opacity-60 font-extralight">
                Meninggalkan Pelajaran
              </p>
            </div>

          </div>

          <hr className="my-2.5 dark:opacity-20" />

          <div className="p-5 rounded-lg border dark:border-zinc-700 text-xs md:text-sm">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="w-full">
                <h1 className="font-bold md:text-3xl">
                  Daftar Siswa Terlambat
                </h1>
                <hr className="my-1 md:my-3 opacity-0" />
                <div className="grid grid-cols-12 px-4 py-3 rounded border dark:border-zinc-700 dark:bg-zinc-800 bg-zinc-100">
                  <p className="opacity-60 col-span-6">Siswa</p>
                  <p className="opacity-60 col-span-3">Kelas </p>
                  <p className="opacity-60 col-span-3">Jumlah </p>
                </div>
                <div className="py-2 relative overflow-auto w-full max-h-[300px]">
                  {total['siswa_terbanyak'].slice(pagination['siswa'] === 1 ? 10 - 10 : (10 * pagination['siswa']) - 10, 10 * pagination['siswa']).map((value, index) => (
                    <div key={index} className="grid grid-cols-12 px-4 py-3">
                      <p className=" col-span-6">
                        {value['nama_siswa']}
                      </p>
                      <p className=" col-span-3">
                        {value['kelas']}
                      </p>
                      <p className=" col-span-3">
                        {value['jumlah_surat']}
                      </p>
                    </div>
                  ))}
                </div>
                <hr className="my-3 opacity-0" />
                <div className="flex justify-center gap-5">
                  <button type="button" onClick={() => setPagination(state => state['siswa'] > 1 ? ({...state, ['siswa']: state['siswa'] - 1}) : ({...state, ['siswa']: state['siswa']}))} className="w-6 h-6 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center">
                    <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit" />
                  </button>
                  <p>Page {pagination['siswa']}</p>
                  <button type="button" onClick={() => setPagination(state => state['siswa'] < Math.ceil(total['siswa_terbanyak'].length / 10) ? ({...state, ['siswa']: state['siswa'] + 1})  : ({...state, ['siswa']: state['siswa']}))} className="w-6 h-6 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center">
                    <FontAwesomeIcon icon={faAngleRight} className="w-3 h-3 text-inherit" />
                  </button>
                </div>
              </div>
              <div className="w-full">
                <h1 className="font-bold md:text-3xl">
                  Daftar Kelas Terlambat
                </h1>
                <hr className="my-1 md:my-3 opacity-0" />
                <div className="grid grid-cols-12 px-4 py-3 rounded border dark:border-zinc-700 dark:bg-zinc-800 bg-zinc-100">
                  <p className="opacity-60 col-span-6">Kelas</p>
                  <p className="opacity-60 col-span-6">Jumlah Surat</p>
                </div>
                <div className="py-2 relative overflow-auto w-full max-h-[300px]">
                  {total['kelas_terbanyak'].slice(pagination['kelas'] === 1 ? 10 - 10 : (10 * pagination['kelas']) - 10, 10 * pagination['kelas']).map((value, index) => (
                    <div key={index} className="grid grid-cols-12 px-4 py-3">
                      <p className=" col-span-6">
                        {value['kelas']}
                      </p>
                      <p className=" col-span-6">
                        {value['jumlah_surat']}
                      </p>
                    </div>
                  ))}
                </div>
                <hr className="my-3 opacity-0" />
                <div className="flex justify-center gap-5">
                  <button type="button" onClick={() => setPagination(state => state['kelas'] > 1 ? ({...state, ['kelas']: state['kelas'] - 1}) : ({...state, ['kelas']: state['kelas']}))} className="w-6 h-6 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center">
                    <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit" />
                  </button>
                  <p>Page {pagination['kelas']}</p>
                  <button type="button" onClick={() => setPagination(state => state['kelas'] < Math.ceil(total['kelas_terbanyak'].length / 10) ? ({...state, ['kelas']: state['kelas'] + 1})  : ({...state, ['kelas']: state['kelas']}))} className="w-6 h-6 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center">
                    <FontAwesomeIcon icon={faAngleRight} className="w-3 h-3 text-inherit" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </MainLayoutPage>
  );
}
