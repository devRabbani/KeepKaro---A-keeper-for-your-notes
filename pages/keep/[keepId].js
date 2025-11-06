import debounce from 'lodash.debounce'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { RiShareForwardLine } from 'react-icons/ri'
import Loading from '../../components/loading'
import ReadContent from '../../components/readContent'
import Toolbar from '../../components/toolBar'
import { useAuth } from '../../contexts/auth/authContext'
import { useKeepSaving } from '../../contexts/keepSaving'
import useAddRecents from '../../hooks/useAddRecents'
import {
  editContent,
  editTitle,
  getKeepData,
  shareKeep,
} from '../../lib/helper'
import s from '../../styles/keepPage.module.css'

export default function KeepPage() {
  // States
  const [data, setData] = useState({
    title: '',
    content: '',
    name: '',
  })

  const [isLoading, setIsLoading] = useState(true)
  const [shareLoading, setShareLoading] = useState(false)

  const [edit, setEdit] = useState(true)

  // Ref
  const isCancel = useRef(false)

  const { title, content, name } = data

  // Saving context
  const { changeKeepSaving } = useKeepSaving()
  const { user } = useAuth()

  // ROuter
  const router = useRouter()
  const {
    query: { keepId },
  } = router

  const isOwn = data?.uid === user?.uid

  // Change Content
  const changeContent = (e) => {
    changeKeepSaving(true)
    setData((prev) => ({
      ...prev,
      content: e.target.value,
    }))
    debounceContent(e.target.value)
  }

  // Change Title
  const changeTitle = (e) => {
    changeKeepSaving(true)
    setData((prev) => ({
      ...prev,
      title: e.target.value,
    }))
    debounceTitle(e.target.value)
  }

  // Debounce Content update
  const debounceContent = useCallback(
    debounce(async (content) => {
      console.count('Runn content')
      try {
        await editContent(keepId, content)
        changeKeepSaving(false)
      } catch (error) {
        console.log(error.message)
        toast.error(<b>{error.message}</b>)
        changeKeepSaving(false)
      }
    }, 1800),
    [keepId]
  )

  // Debounce title update
  const debounceTitle = useCallback(
    debounce(async (title) => {
      console.count('Runn title')
      try {
        await editTitle(keepId, user?.uid, title)
        changeKeepSaving(false)
      } catch (error) {
        console.log(error.message)
        toast.error(<b>{error.message}</b>)
        changeKeepSaving(false)
      }
    }, 1800),
    [keepId]
  )

  // Share keep
  const handleShare = async () => {
    setShareLoading(true)
    try {
      await shareKeep(keepId, title)
      setShareLoading(false)
    } catch (error) {
      console.log(error.message)
      toast.error(<b>{error.message}</b>)
      setShareLoading(false)
    }
  }

  // Side Effects

  // Getting initial Content
  useEffect(() => {
    const handleData = async () => {
      try {
        setIsLoading(true)
        const res = await getKeepData(keepId)
        if (res) {
          if (!isCancel.current) {
            setData(res)
            setIsLoading(false)
          }
        } else {
          router.push('/')
        }
      } catch (error) {
        console.log(error.message)
        toast.error(<b>{error.message}</b>)
        setIsLoading(false)
      }
    }
    keepId && handleData()
  }, [keepId])

  // Cancel Sideeffects
  useEffect(() => {
    isCancel.current = false
    return () => (isCancel.current = true)
  }, [])

  // Adding to Recents
  useAddRecents(title, keepId)

  if (isLoading) {
    return <Loading text="Getting Keep.." />
  }

  return (
    <>
      <Head>
        <title>{title || 'Keep'} | KeepKaro</title>
      </Head>
      <div className={`${s.keepPage} wrapper`}>
        <div className={s.keepInfo}>
          <div className={s.infoMeta}>
            <p className={s.infoLabel}>Kept by</p>
            <p className={s.infoValue}>{name || 'User'}</p>
          </div>
          <div className={s.infoActions}>
            {isOwn ? (
              <>
                <Toolbar
                keepId={keepId}
                edit={edit}
                setEdit={setEdit}
                uid={user?.uid}
              />
              <div className={s.toolbarSeparator} />
              </>

            ) : null}

            <button
              type="button"
              className={`${s.iconButton} ${s.shareButton}`}
              aria-label={shareLoading ? 'Sharing keep' : 'Share keep'}
              title={shareLoading ? 'Sharing keep' : 'Share keep'}
              disabled={shareLoading}
              onClick={handleShare}
              data-loading={shareLoading}
            >
              <RiShareForwardLine />
              <span className={s.srOnly}>
                {shareLoading ? 'Sharing keep' : 'Share keep'}
              </span>
            </button>
          </div>
        </div>
        {edit && isOwn ? (
          <section className={s.editorCard}>
            <input
              className={s.titleField}
              name="title"
              value={title}
              onChange={changeTitle}
              type="text"
              placeholder="Give this keep a title"
              maxLength={100}
            />

            <textarea
              className={s.bodyField}
              wrap="hard"
              name="content"
              value={content}
              onChange={changeContent}
              placeholder="Capture your thoughts, lists, or links here…"
            />
          </section>
        ) : (
          <section className={`${s.editorCard} ${s.readCard}`}>
            <ReadContent title={title} content={content} />
          </section>
        )}
      </div>
    </>
  )
}
