'use client';
import Image from "next/image";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useState, useEffect} from "react";
import { useRouter } from "next/navigation";
export default function Home() {
const {user} = useContext(AuthContext);
const router = useRouter();
useEffect(()=>{
    if(user){
      router.push("/dashboard");
      return ;
    }
    router.push("/login");
    return ;
},[user])
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    </div>
  );
}
