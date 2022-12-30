import Link from 'next/link'
import s from './nav.module.css'
import { RiMenu5Fill, RiSave3Line } from 'react-icons/ri'
import { useState } from 'react'
import Sidebar from './sidebar'
import { useKeepSaving } from '../../contexts/keepSaving'

export default function Nav() {
  const [isMenu, setIsMenu] = useState(false)
  const { keepSaving } = useKeepSaving()
  return (
    <>
      <nav className={s.nav}>
        <div className={`${s.navDiv} wrapper`}>
          <RiMenu5Fill onClick={() => setIsMenu(true)} className={s.menu} />
          {keepSaving ? (
            <span className={s.keeping}>
              <RiSave3Line /> Keeping
            </span>
          ) : (
            <Link href="/">KeepKaro</Link>
          )}
        </div>
      </nav>
      {isMenu ? <Sidebar setIsMenu={setIsMenu} /> : null}
    </>
  )
}
