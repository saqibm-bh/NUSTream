import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async signIn({ user, profile, account }) {
      const allowedDomains = ["nust.edu.pk", "seecs.edu.pk"];
      const email = (user?.email || profile?.email || "").toLowerCase().trim();
      const emailDomain = email.split("@")[1];

      // Restrict access to official NUST domains only.
      if (account?.provider !== "google" || !emailDomain || !allowedDomains.includes(emailDomain)) {
        return "/unauthorized";
      }

      await dbConnect();
      let dbUser = await User.findOne({ email });

      if (!dbUser) {
        dbUser = await User.create({
          name: profile.name,
          email,
          profilePicture: profile.picture,
          isVerified: profile.email_verified ? true : false,
        });
      }
      user.id = dbUser._id.toString();
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 90 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/user-auth",
  },
};
