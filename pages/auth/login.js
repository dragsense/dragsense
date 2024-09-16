import { LoginComponent } from '@/components/index';

import { getProviders, getSession, getCsrfToken, signIn } from "next-auth/react"

export default function Login({ providers, csrfToken }) {

    return (
        <LoginComponent providers={providers} csrfToken={csrfToken} signIn={signIn}/>
    )

}
export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });
  
    if (session && session?.user) {
      return {
        redirect: {
          destination: "/admin/projects",
          permanent: false,
        },
      };
    }
  
    const providers = await getProviders();
    const csrfToken = await getCsrfToken();
  
    return {
      props: { providers, csrfToken },
    };
  }
  