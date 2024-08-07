//require("../assets/styles/variables.less")
import 'antd/dist/reset.css';

import '@/assets/styles/globals.css'

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';


import Script from 'next/script'




import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from 'next-themes';
import { Layout, theme, ConfigProvider, Button } from 'antd';
const { Content } = Layout;
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import { Loading } from '../components';
import { Merriweather } from 'next/font/google'

import { FaSun, FaMoon } from 'react-icons/fa';
import Head from 'next/head';

const { darkAlgorithm, compactAlgorithm, defaultAlgorithm } = theme;

function PageLoading({ }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => setLoading(true);
    const handleComplete = (url) => setLoading(false);

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  })

  return loading && <div style={{
    position: 'fixed', width: '100vw', height: '100vh',
    backgroundColor: 'rgb(189 189 189 / 10%)', zIndex: 1000
  }}><Loading /></div>
}




function MyApp({ Component, pageProps: { session, ...pageProps } }) {

  const [isDarkMode, setIsDarkMode] = useState(false);


  const handleClick = () => {
    setIsDarkMode((previousValue) => !previousValue);
  };

  return ( <><Head>
    <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="DragSense - Complete drag-and-drop builder for creating websites and Node.js apps. Manage CMS collections, media, forms, custom components, and more." />
          <meta name="keywords" content="DragSense, drag-and-drop builder, website builder, Node.js apps, CMS, web development" />
          <meta name="author" content="DragSense Team" />

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
    <ThemeProvider>
      <SessionProvider session={session}>
        <ConfigProvider
          theme={{
            hashed: false,
            algorithm: [isDarkMode ? darkAlgorithm : defaultAlgorithm, compactAlgorithm],
            token: {
              "fontFamily": "'Poppins', sans-serif",
              "colorPrimary": "#f88a24",
              "fontSize": 16,
              "borderRadius": 8,
              "wireframe": true,
              "colorPrimaryBg": "#2fc1ff",
            }

          }
          }
        >
          <Content>
            <PageLoading />

            <Component {...pageProps} /></Content>

          <div style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 10000 }}>
            <Button type='text' onClick={handleClick}>
            {isDarkMode ? <FaSun /> : <FaMoon />}            
            </Button>
          </div>

        </ConfigProvider>
      </SessionProvider>


    </ThemeProvider></>
  )
}

export default MyApp
