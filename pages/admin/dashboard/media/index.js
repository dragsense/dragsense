
import { getSession } from "next-auth/react"
import { MediaComponent } from "@/components/index"

export default function Media({ user }) {

    return (
        <>
            <MediaComponent user={user} />
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