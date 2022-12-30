import { doc, onSnapshot } from 'firebase/firestore'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { RiShareForwardLine } from 'react-icons/ri'
import { useAuth } from '../../contexts/auth/authContext'
import FullLoading from '../../components/fullLoading'
import { useKeepSaving } from '../../contexts/keepSaving'
import useAddRecents from '../../hooks/useAddRecents'
import { db } from '../../lib/firebase'
import { deleteKeep, editContent, editTitle } from '../../lib/helper'
import s from '../../styles/keepPage.module.css'

export default function KeepPage() {
  // States
  const [data, setData] = useState({
    title: '',
    content: '',
    name: '',
  })

  const [isLoading, setIsLoading] = useState(true)

  const { title, content, name } = data

  // Saving context
  const { keepSaving, handleKeepSaving } = useKeepSaving()
  const { user } = useAuth()

  // ROuter
  const router = useRouter()
  const {
    query: { keepId },
  } = router

  // Custom Functions
  const handleChange = (e) => {
    handleKeepSaving(true)
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle Delete
  // const handleDelete = async () => {
  //   try {
  //     const isConfirm = confirm('Are you confirm you want to delete this keep?')
  //     if (isConfirm) {
  //       const id = toast.loading(<b>Deleting please wait...</b>)
  //       setDltLoading(true)
  //       await deleteKeep(keepId, user?.uid)
  //       setDltLoading(false)
  //       toast.success(<b>Deleted successfully</b>, { id })
  //     }
  //   } catch (error) {
  //     console.log(error.message)
  //     setDltLoading(false)
  //     toast.error(<b>{error.message}</b>, { id })
  //   }
  // }

  // Debounce Content update
  const debounceContent = useCallback(
    debounce(async (content) => {
      try {
        await editContent(keepId, content)
        handleKeepSaving(false)
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
      try {
        await editTitle(keepId, user?.uid, title)
        handleKeepSaving(false)
      } catch (error) {
        console.log(error.message)
        toast.error(<b>{error.message}</b>)
      }
    }, 1800),
    []
  )

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
    return <FullLoading text="Getting Keep.." />
  }

  return (
    <div className={`${s.keepPage} wrapper`}>
      <div className={s.keepInfo}>
        <p>Kept by {name || 'User'}</p>
        <button>
          <RiShareForwardLine /> Share this
        </button>
      </div>
      <input
        name="title"
        value={title}
        onChange={handleChange}
        type="text"
        placeholder="Title of the Keep"
      />

      <textarea
        name="content"
        value={content}
        onChange={handleChange}
        placeholder="Type your content here"
      />
    </div>
  )
}
