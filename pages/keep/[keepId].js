import { doc, onSnapshot } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { RiShareForwardLine } from 'react-icons/ri'
import { useAuth } from '../../auth/authContext'
import { useKeepSaving } from '../../contexts/keepSaving'
import { db } from '../../lib/firebase'
import { deleteKeep } from '../../lib/helper'
import s from '../../styles/keepPage.module.css'

export default function KeepPage() {
  // States
  const [data, setData] = useState({
    title: '',
    content: '',
  })
  const [dltLoading, setDltLoading] = useState(false)

  const { title, content } = data

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

  // Side Effects
  // Getting initial Content
  useEffect(() => {
    let unsub
    if (keepId) {
      unsub = onSnapshot(doc(db, 'keeps', keepId), (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.data())
        } else {
          router.push('/')
        }
      })
    }
    return () => unsub && unsub()
  }, [keepId])

  return (
    <div className={`${s.keepPage} wrapper`}>
      <div className={s.keepInfo}>
        <p>Kept by Display Name</p>
        <button disabled={dltLoading} onClick={handleDelete}>
          {dltLoading ? 'Deleting' : 'Delete'}
        </button>
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
