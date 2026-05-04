import NextAuth from "next-auth"
import { authOptions } from "@/lib/authOptions";

const handle = NextAuth(authOptions)
export {handle as POST , handle as GET};
