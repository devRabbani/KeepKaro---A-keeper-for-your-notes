import { toast } from 'react-hot-toast'
import { RiAddCircleLine } from 'react-icons/ri'
import s from './sidebarContent.module.css'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'

export default function SidebarContent({ user }) {
  // Router
  const router = useRouter()

  // Custom Function
  const handleNewKeep = () => {
    if (!user) {
      toast.error(<b>You need to login first!!</b>)
      return
    }
    const keepId = uuidv4()
    router.push('/keep/' + keepId)
  }

  return (
    <div className={s.scrollable}>
      <button onClick={handleNewKeep} className={s.newKeepBtn}>
        New Keep <RiAddCircleLine />
      </button>
    </div>
  )
}
