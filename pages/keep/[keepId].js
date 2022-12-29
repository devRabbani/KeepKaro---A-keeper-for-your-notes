import { useRouter } from 'next/router'
import { RiShareForwardLine } from 'react-icons/ri'
import s from '../../styles/keepPage.module.css'

export default function KeepPage() {
  const {
    query: { keepId },
  } = useRouter()
  return (
    <div className={`${s.keepPage} wrapper`}>
      <input type="text" placeholder="Title of the Keep" />
      <div className={s.keepInfo}>
        <p>Kept by Display Name</p>
        <button>
          <RiShareForwardLine /> Share this
        </button>
      </div>
      <textarea placeholder="Type your content here" />
    </div>
  )
}
