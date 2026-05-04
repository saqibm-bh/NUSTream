import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";



export async function middleware(req){
    const token = await getToken({req,secret:process.env.NEXTAUTH_SECRET});
    const pathname = req.nextUrl.pathname;

    //if user try to go /user-auth after login
    if(pathname === '/user-auth' && token){
        return NextResponse.redirect(new URL('/',req.url));
    }

    //protect meeting routes for authenticated users only
    if(!token && pathname.startsWith('/video-meeting')){
        return NextResponse.redirect(new URL('/',req.url));
    }

    return NextResponse.next();
}
export const config={
    matcher: ['/', '/user-auth', '/video-meeting/:path*']
}
