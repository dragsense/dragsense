import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { authenticate, getMongoClient } from "@/api-helper/middlewares";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { createTransport } from "nodemailer";
import jwt from "jsonwebtoken";
import { findUserByEmail, updateUserById } from "@/api-helper/database";

async function sendPasswordResetRequest(params) {
  const { identifier, provider, theme } = params;

  const mongoClient = await getMongoClient();
  const db = mongoClient.db();

  const user = await findUserByEmail(db, identifier);

  if (!user) throw new Error(`Email not found.`);

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
  const url = process.env.NEXTAUTH_URL + `/auth/reset?token=${token}`;
  const { host } = new URL(url);

  const transport = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: `"DragSense" <${provider.from}>`,
    subject: `Reset Password - ${process.env.NEXTAUTH_URL}`,
    html: html({ url, host, theme, name: "Reset Password" }),
  });

  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }

  await updateUserById(db, user._id, { resetPassword: false });
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
      <p>Hi ${name},</p>
      <p>You requested a password reset. To complete the process, please click the link below:</p>
      <p><a href="${url}" style="color: #007BFF; text-decoration: none; font-weight: bold;">Reset Password</a></p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    
  `;
}

const authOptions = {
  adapter: MongoDBAdapter(getMongoClient()),
  site: process.env.NEXTAUTH_URL,
  cookie: {
    secure: process.env.NODE_ENV && process.env.NODE_ENV === "production",
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
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
        port: parseInt(process.env.EMAIL_HOST_PORT), // Ensure port is parsed as integer
        secure: process.env.EMAIL_HOST_SECURE === "true" ? true : false,
        auth: {
          user: process.env.EMAIL_HOST_USER,
          pass: process.env.EMAIL_HOST_PASS,
        },
        tls: {
          rejectUnauthorized: process.env.EMAIL_SSL_UNAUTH === "true",
        },
      },
      from: process.env.EMAIL,
      redirect: false,
      async sendVerificationRequest({
        theme,
        identifier: email,
        url,
        provider: { server, from },
      }) {
        try {
          await sendPasswordResetRequest({
            theme,
            identifier: email,
            url,
            provider: { server, from },
          });
        } catch (error) {
          throw new Error("Error sending verification email");
        }
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      authorize: authenticate,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: { params: { scope: "read:user user:email" } },
      profile(profile) {
        let email = profile.email;

        if (
          !email &&
          Array.isArray(profile.emails) &&
          profile.emails.length > 0
        ) {
          email =
            profile.emails.find((e) => e.primary)?.email ||
            profile.emails[0].email;
        }

        if (!email) {
          // Generate a unique placeholder email
          email = `github-user-${profile.id}@example.com`;
        }

        return {
          id: profile.id,
          name: profile.name || profile.login,
          email: email,
          image: profile.avatar_url,
          emailVerified: true,
        };
      },
    }),

    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET
    // })
  ],
  pages: {
    signOut: "/auth/login",
    signIn: "/auth/login",
    verifyRequest: "/auth/verify",
    error: "/auth/error",
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
  },
};

export default NextAuth(authOptions);
