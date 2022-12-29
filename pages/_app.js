import '../styles/globals.css'
import '../styles/nprogress.css'
import { Toaster } from 'react-hot-toast'
import { Inter } from '@next/font/google'
import Nav from '../components/nav'
import AuthContextProvider from '../auth/authContext'
import nProgress from 'nprogress'
import { Router } from 'next/router'
import { useEffect } from 'react'
import KeepListsContextProvider from '../contexts/keepLists'
import KeepSavingContextProvider from '../contexts/keepSaving'

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
  console.count('app')
  return (
    <>
      <AuthContextProvider>
        <KeepListsContextProvider>
          <main className={inter.className}>
            <KeepSavingContextProvider>
              <Nav />
              <Component {...pageProps} />
            </KeepSavingContextProvider>
          </main>
        </KeepListsContextProvider>
      </AuthContextProvider>
      <Toaster />
    </>
  )
}
