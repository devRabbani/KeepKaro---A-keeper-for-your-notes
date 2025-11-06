import '../styles/globals.css'
import '../styles/nprogress.css'
import { Toaster } from 'react-hot-toast'
import { Inter } from '@next/font/google'
import Nav from '../components/nav'
import AuthContextProvider from '../contexts/auth/authContext'
import nProgress from 'nprogress'
import { Router } from 'next/router'
import { useEffect } from 'react'
import KeepListsContextProvider from '../contexts/keepLists'
import KeepSavingContextProvider from '../contexts/keepSaving'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  // Loading Animation
  nProgress.configure({ showSpinner: false })

  useEffect(() => {
    const handleStart = () => nProgress.start()
    const handleStop = () => nProgress.done()
    Router.events.on('routeChangeStart', handleStart)
    Router.events.on('routeChangeComplete', handleStop)
    Router.events.on('routeChangeError', handleStop)

    return () => {
      Router.events.off('routeChangeStart', handleStart)
      Router.events.off('routeChangeComplete', handleStop)
      Router.events.off('routeChangeError', handleStop)
    }
  }, [])

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement)
    const getVar = (name, fallback) => {
      const value = rootStyles.getPropertyValue(name).trim()
      if (value) return value
      if (!fallback) return value
      return rootStyles.getPropertyValue(fallback).trim()
    }

    const bannerColor = getVar('--color-warning', '--brand-color')
    const textColor = getVar('--color-base-0', '--brand-foreground')
    const shadowColor = getVar('--color-base-1000', '--color-base-900')
    const infoColor = getVar('--color-border-strong', '--border')

    const bannerStyles = `color: ${bannerColor}; font-size: 4.5em; font-weight: bolder; text-shadow: ${shadowColor} 1px 1px;`
    const textStyles = `color: ${textColor}; font-size: 4.5em; font-weight: bolder; text-shadow: ${shadowColor} 1px 1px;`
    const infoStyles = `color: ${infoColor}; font-size: 1.5em;`

    console.log('%cCan%cWeBe!', bannerStyles, textStyles)
    console.log(
      '%cHey explorer!, Are you lost?? Because this is not the right place for you. If you want to work with us at CanWeBe contact us now.',
      infoStyles
    )
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>KeepKaro - Keep and share your notes and links</title>
      </Head>
      <main className={inter.className}>
        <AuthContextProvider>
          <KeepListsContextProvider>
            <KeepSavingContextProvider>
              <div className="appShell">
                <Nav />
                <div className="appShellContent">
                  <Component {...pageProps} />
                </div>
              </div>
            </KeepSavingContextProvider>
          </KeepListsContextProvider>
        </AuthContextProvider>
      </main>
      <Toaster />
    </>
  )
}
