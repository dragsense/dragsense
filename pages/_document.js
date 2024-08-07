import Document, { Html, Head, Main, NextScript } from "next/document"

export default class MyDocument extends Document {


   render() {
      return (
         <Html>
           <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="DragSense - Complete drag-and-drop builder for creating websites and Node.js apps. Manage CMS collections, media, forms, custom components, and more." />
          <meta name="keywords" content="DragSense, drag-and-drop builder, website builder, Node.js apps, CMS, web development" />
          <meta name="author" content="DragSense Team" />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link 
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800;900&family=Kalam:wght@700&display=swap" 
            rel="stylesheet" 
          />
          <meta property="og:title" content="DragSense - Drag-and-Drop Builder" />
          <meta property="og:description" content="Create websites and Node.js apps with DragSense's complete drag-and-drop builder." />
          <meta property="og:url" content="https://app.dragsense.com" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/dragsense-logo.jpg" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="DragSense - Drag-and-Drop Builder" />
          <meta name="twitter:description" content="Create websites and Node.js apps with DragSense's complete drag-and-drop builder." />
          <meta name="twitter:image" content="/dragsense-logo.jpg" />
        </Head>
            <body>
               <Main />
               <NextScript />

            </body>
         </Html>
      )
   }
}