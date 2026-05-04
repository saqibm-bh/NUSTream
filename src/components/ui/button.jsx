import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[1.15rem] text-sm font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nust-blue disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-nust-blue text-white hover:scale-[1.05] hover:bg-nust-dark",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-white/20 bg-white/70 text-slate-900 shadow-xl backdrop-blur-xl hover:bg-white/80 dark:border-white/10 dark:bg-nust-dark/50 dark:text-slate-100 dark:hover:bg-white/10",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15",
        ghost: "text-slate-700 hover:bg-slate-100 hover:text-nust-blue dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-blue-300",
        link: "text-nust-blue underline-offset-4 hover:underline dark:text-blue-300",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-[1rem] px-3 text-xs",
        lg: "h-10 rounded-[1.25rem] px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * @typedef {import("react").ButtonHTMLAttributes<HTMLButtonElement> & {
 *   asChild?: boolean;
 *   variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
 *   size?: "default" | "sm" | "lg" | "icon";
 * }} ButtonProps
 */

/** @type {import("react").ForwardRefExoticComponent<ButtonProps & import("react").RefAttributes<HTMLButtonElement>>} */
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }

