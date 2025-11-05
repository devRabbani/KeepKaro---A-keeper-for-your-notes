import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { RiDeleteBin5Fill, RiEditFill, RiEyeFill } from 'react-icons/ri'
import { deleteKeep } from '../../lib/helper'
import s from '../../styles/keepPage.module.css'

export default function Toolbar({ keepId, uid, edit, setEdit }) {
  const [dltLoading, setDltLoading] = useState(false)

  const router = useRouter()

  const deleteLabel = dltLoading ? 'Deleting keep' : 'Delete keep'
  const toggleLabel = edit ? 'Switch to read mode' : 'Switch to edit mode'

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
          aria-label={deleteLabel}
          title={deleteLabel}
          onClick={handleDelete}
          className={`${s.iconButton} ${s.dltBtn}`}
        >
          <RiDeleteBin5Fill />
        </button>
        <button
          className={`${s.iconButton} ${s.editBtn}`}
          aria-label={toggleLabel}
          title={toggleLabel}
          onClick={() => setEdit((prev) => !prev)}
        >
          {edit ? <RiEyeFill /> : <RiEditFill />}
        </button>
      </div>
    </div>
  )
}
