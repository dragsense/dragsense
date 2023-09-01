import Document, { Html, Head, Main, NextScript } from "next/document"

export default class MyDocument extends Document {


   render() {
      return (
         <Html>
            <Head>
               <link rel="icon" href="/favicon.ico" sizes="any" />
               <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800;900&family=Kalam:wght@700&display=swap" rel="stylesheet" />
            </Head>
            <body>
               <Main />
               <NextScript />

            </body>
         </Html>
      )
   }
}