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

  return (
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


    </ThemeProvider>
  )
}

export default MyApp
