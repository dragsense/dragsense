
import { getSession } from "next-auth/react"
import { ComponentComponent } from "@/components/index"
import { fetcher } from "@/lib/fetch";
import Head from "next/head";
import 'alloyeditor/dist/alloy-editor/assets/alloy-editor-ocean-min.css';

export default function Components({user}) {

    return (
      <>
      <Head>
        <script>
          window.ALLOYEDITOR_BASEPATH = '/alloyeditor/dist/alloy-editor/';
          window.CKEDITOR_BASEPATH = '/alloyeditor/dist/alloy-editor/';
        </script>
      </Head>
       <ComponentComponent user={user}/>
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