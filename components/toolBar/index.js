import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { RiDeleteBin5Fill, RiEditFill, RiEyeFill } from 'react-icons/ri'
import { deleteKeep } from '../../lib/helper'
import s from '../../styles/keepPage.module.css'

export default function Toolbar({ keepId, uid, edit, setEdit }) {
  const [dltLoading, setDltLoading] = useState(false)

  const router = useRouter()

  // Custom Function
  // Handle Delete
  const handleDelete = async () => {
    try {
      const isConfirm = confirm('Are you confirm you want to delete this keep?')
      if (isConfirm) {
        const id = toast.loading(<b>Deleting please wait...</b>)
        setDltLoading(true)
        await deleteKeep(keepId, uid)
        let recents = localStorage.getItem('recents')
        if (recents) {
          recents = JSON.parse(recents)
          recents.shift()
          localStorage.setItem('recents', JSON.stringify(recents))
        }
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

  return (
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
        <button className={s.editBtn} onClick={() => setEdit((prev) => !prev)}>
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
  )
}
