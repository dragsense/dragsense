
import { getSession } from "next-auth/react";

import { UsersComponent } from "@/components/index";

export default function Users({ user }) {

  return ( 
    <> 
      <UsersComponent user={user} />
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

  let admin = false;
  if (session.user.email === process.env.ADMIN) admin = true;

  return {
    props: { user: { ...session.user, admin } },
  };
}