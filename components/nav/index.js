import Link from 'next/link'
import s from './nav.module.css'
import { RiMenu5Fill } from 'react-icons/ri'
import { useState } from 'react'
import Sidebar from './sidebar'

export default function Nav() {
  const [isMenu, setIsMenu] = useState(false)
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
