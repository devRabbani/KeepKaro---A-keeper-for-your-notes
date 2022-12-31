import Link from 'next/link'
import s from './nav.module.css'
import { RiEditFill, RiEyeFill, RiMenu5Fill, RiSave3Line } from 'react-icons/ri'
import { useState } from 'react'
import Sidebar from './sidebar'
import { useKeepSaving } from '../../contexts/keepSaving'
import { useRouter } from 'next/router'

export default function Nav() {
  const [isMenu, setIsMenu] = useState(false)
  const { dispatch } = useKeepSaving()

  const router = useRouter()
  const {
    query: { keepId, edit },
  } = router

  console.log(edit, keepId, edit)
  return (
    <>
      <nav className={s.nav}>
        <div className={`${s.navDiv} wrapper`}>
          <RiMenu5Fill onClick={() => setIsMenu(true)} className={s.menu} />
          <Link href="/">KeepKaro</Link>
        </div>
      </nav>
      {isMenu ? <Sidebar setIsMenu={setIsMenu} /> : null}
    </>
  )
}
