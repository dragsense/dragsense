import { RegisterComponent } from '@/components/index';
import { getSession } from "next-auth/react"


export default function Register() {
    return (
        <RegisterComponent />
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

