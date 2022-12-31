import { doc, onSnapshot } from 'firebase/firestore'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  RiDeleteBin5Fill,
  RiEditFill,
  RiEyeFill,
  RiShareForwardLine,
} from 'react-icons/ri'
import Loading from '../../components/loading'
import ReadContent from '../../components/readContent'
import { useAuth } from '../../contexts/auth/authContext'
import { useKeepSaving } from '../../contexts/keepSaving'
import useAddRecents from '../../hooks/useAddRecents'
import { db } from '../../lib/firebase'
import { deleteKeep, editContent, editTitle, shareKeep } from '../../lib/helper'
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
  const [dltLoading, setDltLoading] = useState(false)
  const [edit, setEdit] = useState(false)

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

  // Custom Functions
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle Delete
  const handleDelete = async () => {
    try {
      const isConfirm = confirm('Are you confirm you want to delete this keep?')
      if (isConfirm) {
        const id = toast.loading(<b>Deleting please wait...</b>)
        setDltLoading(true)
        await deleteKeep(keepId, user?.uid)
        setDltLoading(false)
        toast.success(<b>Deleted successfully</b>, { id })
      }
    } catch (error) {
      console.log(error.message)
      setDltLoading(false)
      toast.error(<b>{error.message}</b>, { id })
    }
  }

  // Debounce Content update
  const debounceContent = useCallback(
    debounce(async (content) => {
      changeKeepSaving(true)
      try {
        await editContent(keepId, content)
        changeKeepSaving(false)
      } catch (error) {
        console.log(error.message)
        toast.error(<b>{error.message}</b>)
      }
    }, 1800),
    []
  )

  // Debounce title update
  const debounceTitle = useCallback(
    debounce(async (title) => {
      changeKeepSaving(true)
      try {
        await editTitle(keepId, user?.uid, title)
        changeKeepSaving(false)
      } catch (error) {
        console.log(error.message)
        toast.error(<b>{error.message}</b>)
      }
    }, 1800),
    []
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
    let unsub
    if (keepId) {
      unsub = onSnapshot(doc(db, 'keeps', keepId), (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.data())
          setIsLoading(false)
        } else {
          router.push('/')
        }
      })
    }
    return () => unsub && unsub()
  }, [keepId])

  // Update Content

  useEffect(() => {
    debounceContent(content)
  }, [content])

  // Update title

  useEffect(() => {
    debounceTitle(title)
  }, [title])

  // Adding to Recents
  useAddRecents(title, keepId)

  if (isLoading) {
    return <Loading text="Getting Keep.." />
  }

  return (
    <div className={`${s.keepPage} wrapper`}>
      {isOwn ? (
        <div className={s.toolbarWrapper}>
          <div className={s.toolbar}>
            <button
              disabled={dltLoading}
              onClick={handleDelete}
              className={s.dltBtn}
            >
              <RiDeleteBin5Fill />
              {dltLoading ? 'Deleting' : 'Delete'}
            </button>
            <button
              className={s.editBtn}
              onClick={() => setEdit((prev) => !prev)}
            >
              {edit ? (
                <>
                  <RiEyeFill />
                  Read
                </>
              ) : (
                <>
                  <RiEditFill />
                  Edit
                </>
              )}
            </button>
          </div>
        </div>
      ) : null}

      <div className={s.keepInfo}>
        <p>Kept by {name || 'User'}</p>
        <button disabled={shareLoading} onClick={handleShare}>
          <RiShareForwardLine /> {shareLoading ? 'Sharing' : 'Share this'}
        </button>
      </div>
      {edit && isOwn ? (
        <>
          <input
            name="title"
            value={title}
            onChange={handleChange}
            type="text"
            placeholder="Title of the Keep"
          />

          <textarea
            wrap="hard"
            name="content"
            value={content}
            onChange={handleChange}
            placeholder="Type your content here"
          />
        </>
      ) : (
        <ReadContent title={title} content={content} />
      )}
    </div>
  )
}
