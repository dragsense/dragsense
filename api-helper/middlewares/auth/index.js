import { findUserWithEmailAndPassword } from "../../database/users"
import { getServerSession } from "next-auth/next"

import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { getMongoClient } from "@/api-helper/middlewares";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";


export async function authenticate(credentials) {

  const { email, password } = credentials;
  const client = await getMongoClient();
  const db = client.db();
  const user = await findUserWithEmailAndPassword(db, email, password);

  if (user) return { ...user };
  else
    return null;

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
    CredentialsProvider({
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
    signIn: "/auth/login",
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
      console.log(session)
      return Promise.resolve(session);
    },
  }
}

export default async function authorize(req, res, next) {
  const session = await getServerSession(req, res, authOptions)
  if (!session || !session?.user)
    return res.status(401).end();

  req.user = session.user;
  return next();

}