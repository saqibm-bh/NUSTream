"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Info, LogOut, Moon, Plus, Sun, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'

const Header = () => {
    const {theme,setTheme} = useTheme();
    const {data:session}= useSession();
    const [open,setOpen]= useState(false)


    const formatTimeDate =()=>{
        const now = new Date();
        return now.toLocaleString("en-US",{
            hour:'numeric',
            minute:'numeric',
            hour12:true,
            weekday:'short',
            month:'short',
            day:"numeric"
        })
    }

    const userPlaceHolder = session?.user?.name?.split(" ").map((name)=> name[0]).join("")

    const handlelogout = async() =>{
        await signOut({callbackUrl:'/'})
    }
  return (
    <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 pointer-events-none">
      <div className="pointer-events-auto flex w-full max-w-[85rem] items-center justify-between rounded-[2rem] border border-white/20 bg-white/70 px-6 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#020817]/70 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-nust-blue to-blue-700 dark:from-blue-500 dark:to-blue-700 shadow-md transition-transform group-hover:scale-105">
              <Image src="/nust-logo.png" alt="NUST logo" width={22} height={22} className="h-5 w-5 object-contain" />
            </div>
            <span className="hidden sm:block text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              NUSTream
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <span className="hidden lg:block text-sm font-medium text-slate-500 dark:text-slate-400 mr-2">
            {formatTimeDate()}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-blue-300 transition-all hover:rotate-90" />
            ) : (
              <Moon className="w-5 h-5 text-nust-blue transition-all hover:-rotate-12" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <Info className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Button>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer border-2 border-transparent hover:border-nust-blue dark:hover:border-blue-400 transition-all duration-300 shadow-sm ml-1">
                {session?.user?.image ? (
                  <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                ) : (
                  <AvatarFallback className="text-sm font-semibold bg-nust-blue text-white dark:bg-blue-600 dark:text-white">
                    {userPlaceHolder}
                  </AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 p-5 rounded-[2rem] border-white/20 bg-white/90 shadow-2xl backdrop-blur-3xl dark:border-white/10 dark:bg-[#020817]/90 transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  Account
                </span>
                <Button
                  className="rounded-full h-8 w-8 p-0 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col items-center mb-6">
                <Avatar className="w-24 h-24 mb-4 ring-4 ring-nust-blue/10 dark:ring-blue-500/20 shadow-xl">
                  {session?.user?.image ? (
                    <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                  ) : (
                    <AvatarFallback className="text-3xl font-bold bg-nust-blue text-white dark:bg-blue-600 dark:text-white">
                      {userPlaceHolder}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Hi, {session?.user?.name?.split(" ")[0]}!
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {session?.user?.email}
                </p>
              </div>
              <div className="flex shadow-sm rounded-[1.5rem] overflow-hidden border border-slate-200 dark:border-slate-700/50 mb-4">
                <Button
                  className="w-1/2 h-12 rounded-none border-0 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-nust-blue dark:text-blue-300"
                  variant="ghost"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <div className="w-px bg-slate-200 dark:bg-slate-700/50" />
                <Button
                  className="w-1/2 h-12 rounded-none border-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 font-semibold"
                  variant="ghost"
                  onClick={handlelogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                <Link href="#" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                  Privacy Policy
                </Link>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <Link href="#" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default Header
