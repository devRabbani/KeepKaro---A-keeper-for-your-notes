import { doc, onSnapshot } from 'firebase/firestore'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
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
import {
  deleteKeep,
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
  const [dltLoading, setDltLoading] = useState(false)
  const [edit, setEdit] = useState(false)

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

  // Handle Delete
  const handleDelete = async () => {
    try {
      const isConfirm = confirm('Are you confirm you want to delete this keep?')
      if (isConfirm) {
        const id = toast.loading(<b>Deleting please wait...</b>)
        setDltLoading(true)
        await deleteKeep(keepId, user?.uid)
        setDltLoading(false)
        router.push('/')
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
      console.count('Runn content')
      try {
        await editContent(keepId, content)
        changeKeepSaving(false)
      } catch (error) {
        console.log(error.message)
        toast.error(<b>{error.message}</b>)
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
            onChange={changeTitle}
            type="text"
            placeholder="Title of the Keep"
            maxLength={100}
          />

          <textarea
            wrap="hard"
            name="content"
            value={content}
            onChange={changeContent}
            placeholder="Type your content here"
          />
        </>
      ) : (
        <ReadContent title={title} content={content} />
      )}
    </div>
  )
}
