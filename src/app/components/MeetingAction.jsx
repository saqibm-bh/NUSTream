"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Copy, Link2, LinkIcon, Plus, Video } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Loader from './Loader'

const meetingSchema = z.object({
  meetingLink: z.string().min(1, "Room code or link is required").regex(/^[a-zA-Z0-9\-/:.]+$/, "Invalid characters in link or code"),
});

const MeetingAction = () => {
  const [isLoading,setIsLoading] = useState()
  const [isDialogOpen,setIsDialogOpen] = useState(false)
  const [baseUrl,setBaseUrl] = useState("")
  const router = useRouter()
  const [generatedMeetingUrl,setGeneratedMeetingUrl] = useState("")

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(meetingSchema),
    defaultValues: { meetingLink: "" }
  });

  useEffect(() =>{
    setBaseUrl(window.location.origin)
  },[])

  const handleCreateMeetingForLater =() =>{
    const roomId=  uuidv4();
    const url = `${baseUrl}/video-meeting/${roomId}`
    setGeneratedMeetingUrl(url)
    setIsDialogOpen(true);
    toast.success("meeting link created successfully")
  }

  const onSubmitJoin = (data) => {
    setIsLoading(true);
    const { meetingLink } = data;
    const formattedLink = meetingLink.includes("http")
      ? meetingLink
      : `${baseUrl}/video-meeting/${meetingLink}`;
    router.push(formattedLink);
    toast.info("joining meeting...");
  };

  const handleStartMeeting = () =>{
    setIsLoading(true);
     const roomId=  uuidv4();
    const meetingUrl = `${baseUrl}/video-meeting/${roomId}`
    router.push(meetingUrl)
    toast.info('joining meeting...')
  }

  const copyToClipboard =() =>{
    navigator.clipboard.writeText(generatedMeetingUrl);
    toast.success('Meeting link copied')
  }
  return (
    <>
    {isLoading && <Loader/>}
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-to-r from-nust-blue to-blue-600 hover:from-blue-600 hover:to-nust-blue text-white shadow-[0_8px_20px_rgba(0,51,102,0.2)] dark:shadow-[0_8px_20px_rgba(0,51,102,0.4)] transition-all hover:scale-[1.02] active:scale-95 font-semibold tracking-wide" size="lg">
                <Video className='w-5 h-5 mr-3'/>
                New meeting
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-2xl p-2 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-nust-dark/95 backdrop-blur-xl shadow-2xl">
            <DropdownMenuItem onClick={handleCreateMeetingForLater} className="rounded-xl px-4 py-3 cursor-pointer focus:bg-nust-blue/5 dark:focus:bg-white/5 transition-colors">
              <Link2 className='w-5 h-5 mr-3 text-slate-500 dark:text-slate-400'/>
              <span className="font-medium text-slate-700 dark:text-slate-200">Create a meeting for later</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleStartMeeting} className="rounded-xl px-4 py-3 cursor-pointer focus:bg-nust-blue/5 dark:focus:bg-white/5 transition-colors mt-1">
              <Plus className='w-5 h-5 mr-3 text-slate-500 dark:text-slate-400'/>
             <span className="font-medium text-slate-700 dark:text-slate-200">Start an instant meeting</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
         </DropdownMenu>

         <form onSubmit={handleSubmit(onSubmitJoin)} className='flex flex-col w-full sm:w-auto relative group'>
           <div className="flex w-full relative shadow-sm rounded-full overflow-hidden transition-all group-focus-within:shadow-md group-focus-within:ring-2 ring-nust-blue/20 dark:ring-blue-500/20">
            <span className='absolute left-4 top-1/2 transform -translate-y-1/2'>
              <LinkIcon className='w-4 h-4 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-nust-blue dark:group-focus-within:text-blue-300'/>
            </span>
            <Input
              placeholder='Enter code or link'
              className={`h-12 pl-11 rounded-none border-0 bg-white dark:bg-[#020817] pr-10 focus-visible:ring-0 ${errors.meetingLink ? 'text-red-600 placeholder:text-red-300' : ''}`}
              {...register("meetingLink")}
            />
            <Button
             type="submit"
             variant="ghost"
             className="h-12 px-6 rounded-none bg-white dark:bg-[#020817] text-nust-blue font-bold hover:bg-slate-50 dark:hover:bg-white/5 dark:text-blue-300 transition-colors active:bg-slate-100"
            >
              Join
            </Button>
           </div>
           {errors.meetingLink && (
             <span className="text-red-500 text-xs font-semibold mt-1 absolute -bottom-5 left-4">{errors.meetingLink.message}</span>
           )}
         </form>
    </div>
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-md rounded-[2rem] border-white/20 bg-white/90 p-8 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#020817]/90 text-center">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-nust-blue/10 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
             <Link2 className="w-8 h-8 text-nust-blue dark:text-blue-300" />
          </div>
          <DialogTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Here is your joining info
          </DialogTitle>
        </DialogHeader>
        <div className='flex flex-col space-y-6 mt-4'>
          <p className='text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium'>
            Send this to people you want to meet with. Make sure to save it so you can use it later, too.
          </p>
          <button
            type="button"
            onClick={copyToClipboard}
            className='flex w-full items-center justify-between rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 p-4 text-left transition hover:border-nust-blue dark:hover:border-blue-400 active:scale-[0.98] dark:bg-[#020817]'
          >
             <span className='text-slate-900 dark:text-slate-100 break-all font-mono text-sm tracking-wide'>
                 {generatedMeetingUrl.length > 35 ? generatedMeetingUrl.slice(0,35) + '...' : generatedMeetingUrl}
             </span>
             <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-nust-blue/10 dark:bg-blue-500/10 group hover:bg-nust-blue hover:text-white transition-colors">
                 <Copy className='w-5 h-5 text-nust-blue dark:text-blue-300 hover:text-white'/>
             </span>
          </button>
        </div>
      </DialogContent>
         
    </Dialog>
    </>
  )
}

export default MeetingAction

