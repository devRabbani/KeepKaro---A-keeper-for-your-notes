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
    console.log(
      '%cCan%cWeBe!',
      'color: #e47e24; font-size: 4.5em; font-weight: bolder; text-shadow: #000 1px 1px;',
      'color: #fff; font-size: 4.5em; font-weight: bolder; text-shadow: #000 1px 1px;'
    )
    console.log(
      '%cHey explorer!, Are you lost?? Because this is not the right place for you. If you want to work with us at CanWeBe contact us now.',
      'color: #e1e1e1; font-size: 1.5em;'
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
