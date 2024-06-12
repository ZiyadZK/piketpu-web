'use client'

import MainLayoutPage from "@/components/mainLayout";
import { animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion"

export default function Home() {
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)

  useEffect(() => {
    const controls = animate(count, 100, {duration: 15, ease: 'easeInOut'})

    return () => controls.stop()
  }, [])

  return (
    <MainLayoutPage>
      <Toaster />
      <div className="mt-5 dark:text-zinc-200 text-zinc-700">
        
      </div>
    </MainLayoutPage>
  );
}
