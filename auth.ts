import NextAuth from "next-auth";
import Google from "next-auth/providers/google"
import Nodemailer from "next-auth/providers/nodemailer"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Nodemailer({
      server: {
        host: process.env.AUTH_EMAIL_SERVER_HOST,
        port: process.env.AUTH_EMAIL_SERVER_PORT,
        auth: {
          user: process.env.AUTH_EMAIL_SERVER_USER,
          pass: process.env.AUTH_EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.AUTH_EMAIL_FROM,
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
});
