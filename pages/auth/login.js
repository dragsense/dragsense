import { LoginComponent } from '@/components/index';

import { getProviders, getSession, getCsrfToken, signIn } from "next-auth/react"

export default function Login({ providers, csrfToken }) {

    return (
        <LoginComponent providers={providers} csrfToken={csrfToken} signIn={signIn}/>
    )

}

export async function getServerSideProps(context) {

    const { req, res } = context;
    const session = await getSession({ req });

    if (session && session?.user) {
        res.writeHead(302, {
            Location: "/admin/projects",
        });
        return res.end();
     
    }

    const providers = await getProviders();
    const csrfToken = await getCsrfToken();

    return {
        props: { providers, csrfToken },
    }
}