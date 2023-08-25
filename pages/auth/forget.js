import { ForgetComponent } from '@/components/index';
import { getSession, signIn } from "next-auth/react"
import {  } from "next-auth/react"


export default function Register() {
    return (
        <ForgetComponent signIn={signIn} />
    )
}

export async function getServerSideProps(context) {

    const { req, res } = context;
    const session = await getSession({ req });

    if (session && session?.user) {
        res.writeHead(302, {
            Location: "/",
        });
       
        return  res.end();
      
    }
    return {
        props: {},
    }
}

