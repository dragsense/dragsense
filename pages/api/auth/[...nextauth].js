import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { authenticate, getMongoClient } from "@/api-helper/middlewares";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { createTransport } from "nodemailer"
import jwt from 'jsonwebtoken'
import {
  findUserByEmail,
  updateUserById,
} from '@/api-helper/database';


async function sendPasswordResetRequest(params) {
  const { identifier, provider, theme } = params;

  const mongoClient = await getMongoClient();
  const db = mongoClient.db();

  const user = await findUserByEmail(db, identifier);

  if (!user)
    throw new Error(`Email not found.`)

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET,
    {
      expiresIn: '30m'
    })
  const url = process.env.NEXTAUTH_URL + `/auth/reset?token=${token}`;
  const { host } = new URL(url) 


  const transport = createTransport(provider.server)
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Reset Password - ${process.env.NEXTAUTH_URL}`,
    html: html({ url, host, theme, name: "Reset Password" }),
  })


  const failed = result.rejected.concat(result.pending).filter(Boolean)
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
  }

  await updateUserById(db, user._id, { resetPassword: false })
}

function html(params) {
  const { url, host, theme, name } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = theme.primaryColor || "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.primaryColorBg || "#fff",
  };

  return `
    <body style="background: ${color.background};">
      <table width="100%" border="0" cellspacing="20" cellpadding="0"
        style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
          <td align="center"
            style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
            ${name} - ${escapedHost}
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
                  <a href="${url}"
                    target="_blank"
                    style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Reset Password</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center"
            style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
            If you didn't request a password reset, please ignore this email.
          </td>
        </tr>
      </table>
    </body>
  `;
}

const authOptions = {
  adapter: MongoDBAdapter(getMongoClient()),
  site: process.env.NEXTAUTH_URL,
  cookie: {
    secure: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  providers: [
    EmailProvider({
      id: "forgot-password",
      type: "email",
      name: "Forgot password?",
      server: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_HOST_PORT,
        auth: {
          user: process.env.EMAIL_HOST_USER,
          pass: process.env.EMAIL_HOST_PASS,
        },
      },
      from: process.env.EMAIL_HOST_USER,
      sendVerificationRequest({
        theme,
        identifier: email,
        url,
        provider: { server, from },
      }) {
        sendPasswordResetRequest({
          theme,
          identifier: email,
          url,
          provider: { server, from },
        })
      },
      
    }),
    CredentialsProvider({
      id: 'credentials',
      name: "Credentials",
      authorize: authenticate
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
 
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
  pages: {
    signOut: '/auth/login',
    signIn: "/auth/login",
    verifyRequest: "/auth/verify",
    error: '/auth/error',
  },
  callback: {
    async jwt(token, user, account, profile, isNewUser) {
      const isUserSignedIn = user ? true : false;
      if (isUserSignedIn) {
        token.id = user._id.toString();

      }

      return Promise.resolve(token);
    },
    async session(session, token) {
      session.id = token.id;
      return Promise.resolve(session);
    },
  }
}

export default NextAuth(authOptions)