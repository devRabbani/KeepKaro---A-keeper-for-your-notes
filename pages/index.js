import Head from 'next/head'
import Link from 'next/link'
import { useRef, useState } from 'react'
import Loading from '../components/loading'
import { useAuth } from '../contexts/auth/authContext'
import { useKeepsList } from '../contexts/keepLists'
import s from '../styles/Home.module.css'

export default function Home() {
  const { data, loading } = useKeepsList()

  const { user } = useAuth()
  const recents = JSON.parse(localStorage.getItem('recents'))

  // Getting share Data
  const parsedUrl = new URL(window.location.toString())
  const title = parsedUrl.searchParams.get('title')
  const text = parsedUrl.searchParams.get('text')

  const [isCopied, setIsCopied] = useState(false)

  const shareRef = useRef()

  // Functions
  // COpy to clipboard
  const handleCopy = () => {
    const value = shareRef.current.innerText
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value)
      setIsCopied(true)
    }
  }

  if (loading) {
    return <Loading text="Getting Data.." />
  }

  return (
    <>
      <Head>
        <title>Home | KeepKaro</title>
      </Head>

      <div className={`${s.homePage} wrapper`}>
        {!!title || !!text ? (
          <>
            <p className={s.shareP}>Share Data:</p>
            <div className={s.shareData} ref={shareRef}>
              {title} <br />
              {text}
            </div>
            <div className={s.btnDiv}>
              <button onClick={handleCopy}>
                {isCopied ? 'Copied' : 'Copy'}
              </button>
              <Link href="/">Cancel</Link>
            </div>
          </>
        ) : null}

        <h1>Welcome {user?.displayName || 'User'}</h1>

        <h3 className={s.recentlyViewed}>Recently Viewed</h3>
        {recents?.length ? (
          <div className={s.keepLists}>
            {recents.map((keep) => (
              <Link
                className={s.keep}
                key={keep?.keepId}
                href={'/keep/' + keep?.keepId}
              >
                {keep.title}
              </Link>
            ))}
          </div>
        ) : (
          <p className={s.noData}>No Recents data found</p>
        )}
        <h3>Your Keeps</h3>
        {data?.length ? (
          <div className={s.keepLists}>
            {data.map((keep) => (
              <Link
                className={s.keep}
                key={keep?.keepId}
                href={'/keep/' + keep?.keepId}
              >
                {keep.title}
              </Link>
            ))}
          </div>
        ) : (
          <p className={s.noData}>No Keep found try to add one!</p>
        )}
      </div>
    </>
  )
}
