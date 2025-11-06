import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-hot-toast'
import Loading from '../components/loading'
import { useAuth } from '../contexts/auth/authContext'
import { useKeepsList } from '../contexts/keepLists'
import { createKeep } from '../lib/helper'
import s from '../styles/Home.module.css'

export default function Home() {
  const { data, loading } = useKeepsList()

  const { user } = useAuth()
  const router = useRouter()

  const [recents, setRecents] = useState([])
  const [sharePayload, setSharePayload] = useState({
    title: '',
    text: '',
  })

  const [isCopied, setIsCopied] = useState(false)
  const shareRef = useRef()

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const storedRecents = window.localStorage.getItem('recents')
      setRecents(storedRecents ? JSON.parse(storedRecents) : [])
    } catch (error) {
      console.log(error)
      setRecents([])
    }

    try {
      const parsedUrl = new URL(window.location.href)
      const title = parsedUrl.searchParams.get('title') || ''
      const text = parsedUrl.searchParams.get('text') || ''
      setSharePayload({ title, text })
    } catch (error) {
      console.log(error)
      setSharePayload({ title: '', text: '' })
    }
  }, [])

  useEffect(() => {
    if (!isCopied) return
    const timer = setTimeout(() => setIsCopied(false), 2500)
    return () => clearTimeout(timer)
  }, [isCopied])

  const handleCreateKeep = async () => {
    if (!user) {
      toast.error(<b>Please sign in to create a new keep.</b>)
      return
    }

    if (data?.length > 15) {
      toast.error(
        <b>Maximum keeps reached. Delete an old keep to add a new one.</b>
      )
      return
    }

    try {
      const keepId = uuidv4()
      await createKeep(keepId, user.uid, user.displayName || 'User')
      toast.success(<b>New keep ready.</b>)
      router.push('/keep/' + keepId)
    } catch (error) {
      console.log(error.message)
      toast.error(<b>{error.message}</b>)
    }
  }

  // Functions
  // COpy to clipboard
  const handleCopy = () => {
    const value = shareRef.current?.innerText?.trim()
    if (!value) return
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value)
      setIsCopied(true)
    } else {
      toast.error(<b>Clipboard is not available on this device.</b>)
    }
  }

  if (loading) {
    return <Loading text="Getting Data..." />
  }

  console.log(sharePayload.title,'title')

  return (
    <>
      <Head>
        <title>Home | KeepKaro</title>
      </Head>

      <div className={`${s.homePage} wrapper`}>


        {sharePayload.title || sharePayload.text ? (
          <section className={s.shareCard}>
              <p className={s.shareHeader}>Copy the content and go to your keep and paste it</p>
            <div className={s.shareContent} ref={shareRef}>
              {sharePayload.title && (
                <strong>{sharePayload.title}</strong>
              )}
              {sharePayload.text ? (
                <span>{sharePayload.text}</span>
              ) : null}
            </div>
            <div className={s.shareActions}>
              <button onClick={handleCopy} className={s.copyAction}>
                {isCopied ? 'Copied!' : 'Copy to clipboard'}
              </button>
            </div>
          </section>
        ) :  <section className={s.hero}>
          <div className={s.heroContent}>
            <p className={s.welcomeBadge}>Welcome back</p>
            <h1>
              {user?.displayName
                ? `${user.displayName.split(' ')[0]}, your ideas are safe here.`
                : 'KeepKaro keeps your ideas within reach.'}
            </h1>
            <p className={s.heroCopy}>
              Save the ideas, links, and lists that matter most. KeepKaro keeps
              them close so you can start fresh or jump back in within a tap.
            </p>
            <div className={s.heroActions}>
              <button onClick={handleCreateKeep} className={s.primaryAction}>
                Start a new keep
              </button>
              {data?.length ? (
                <Link
                  href={'/keep/' + data[0]?.keepId}
                  className={s.secondaryAction}
                >
                  Open latest keep
                </Link>
              ) : null}
            </div>
          </div>
        </section>}

        <section className={s.section}>
          <div className={s.sectionHeader}>
            <h2>Recently viewed</h2>
            <span>Handy quick access to your last 3 notes.</span>
          </div>
          {recents?.length ? (
            <div className={s.keepLists}>
              {recents.map((keep) => (
                <Link
                  className={s.keep}
                  key={keep?.keepId}
                  href={'/keep/' + keep?.keepId}
                >
                  <span>{keep.title}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className={s.noData}>
              Recent keeps will show up here once you open a note.
            </p>
          )}
        </section>

        <section className={s.section}>
          <div className={s.sectionHeader}>
            <h2>Your keeps</h2>
            <span>
              {data?.length
                ? `You have ${data.length} ${
                    data.length === 1 ? 'keep' : 'keeps'
                  } saved.`
                : 'Create your first keep to get started.'}
            </span>
          </div>
          {data?.length ? (
            <div className={s.keepLists}>
              {data.map((keep) => (
                <Link
                  className={s.keep}
                  key={keep?.keepId}
                  href={'/keep/' + keep?.keepId}
                >
                  <span>{keep.title}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className={s.noData}>
              No keeps yet. Tap “Start a new keep” to draft your first one.
            </p>
          )}
        </section>
      </div>
    </>
  )
}
