import { toast } from 'react-hot-toast'
import { RiAddCircleLine } from 'react-icons/ri'
import s from './sidebarContent.module.css'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import { useKeepsList } from '../../contexts/keepLists'
import Link from 'next/link'
import { createKeep } from '../../lib/helper'

export default function SidebarContent({ user, setIsMenu }) {
  // Router
  const router = useRouter()
  const {
    query: { keepId: keepIdUrl },
  } = router

  // Getting keep lists
  const { data, loading } = useKeepsList()

  // Custom Function
  // Create new keep
  const handleNewKeep = async () => {
    if (!user) {
      toast.error(<b>You need to login first!!</b>)
      return
    }
    if (data?.length > 15) {
      toast.error(
        <b>Ohh oh Max number of keeps. Please delete unwanted keeps.</b>
      )
      return
    }
    try {
      const keepId = uuidv4()
      await createKeep(keepId, user?.uid, user?.displayName)
      setIsMenu(false)
      router.push('/keep/' + keepId)
    } catch (error) {
      console.log(error.message)
      toast.error(<b>{error.message}</b>)
    }
  }

  const handleClick = () => {
    setIsMenu(false)
  }

  return (
    <div className={s.scrollable}>
      <button onClick={handleNewKeep} className={s.newKeepBtn}>
        New Keep <RiAddCircleLine />
      </button>
      <div className={s.scrollableContent}>
        {loading ? (
          <p>Getting Keeps list..</p>
        ) : (
          data?.map((keep) => (
            <Link
              onClick={handleClick}
              href={'/keep/' + keep.keepId}
              key={keep.keepId}
              className={keepIdUrl === keep.keepId ? 'active' : ''}
            >
              {keep.title}
              <div className={s.gradient} />
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
