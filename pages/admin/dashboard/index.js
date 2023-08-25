
import { getSession } from "next-auth/react"
import { DashboardComponent } from "@/components/index"
import Head from "next/head";

export default function Dashboard({user}) {

    return (
      <>
       <DashboardComponent user={user} />
      </>
    )
 

}

export async function getServerSideProps(context) {

  const { req, res } = context;
  const session = await getSession({ req });

  if (!session && !session?.user) {
      res.writeHead(302, {
          Location: "/auth/login",
      });
      return res.end();
   
  }

  return {
      props: { user: session.user},
  }
}