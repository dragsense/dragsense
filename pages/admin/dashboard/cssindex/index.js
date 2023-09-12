
'use client';


import { getSession } from "next-auth/react"
import { CSSComponent } from "@/components/index"
import { fetcher } from "@/lib/fetch";



export default function CSSCode({ user }) {

    return (
        <>
            <CSSComponent user={user} />
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
        props: { user: session.user },
    }
}