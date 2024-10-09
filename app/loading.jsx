"use client";

import { Logo } from "@/public/img";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 z-[999999] bg-white w-screen h-screen justify-center items-center flex">
      <div className="relative flex w-64 animate-pulse gap-2 p-4">
        <Image
          className="px-4 w-72"
          src={Logo}
          alt="Logo"
          width={100}
          height={100}
        />
      </div>
    </div>
  );
}
