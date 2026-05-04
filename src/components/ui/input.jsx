import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-[1rem] border border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-900 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nust-blue disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-nust-dark/50 dark:text-slate-100 dark:file:text-slate-50 dark:placeholder:text-slate-400",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }

