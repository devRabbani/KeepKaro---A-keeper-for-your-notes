import Link from 'next/link'
import s from './nav.module.css'
import { RiEditFill, RiEyeFill, RiMenu5Fill, RiSave3Line } from 'react-icons/ri'
import { useEffect, useRef, useState } from 'react'
import Sidebar from './sidebar'
import { useKeepSaving } from '../../contexts/keepSaving'
import { useRouter } from 'next/router'

export default function Nav() {
  const [isMenu, setIsMenu] = useState(false)

  const sidebarRef = useRef(null)

  const router = useRouter()
  const { keepSaving } = useKeepSaving()

  useEffect(() => {
    const handler = (e) => {
      if (!sidebarRef?.current?.contains(e.target)) {
        setIsMenu(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <nav className={s.nav}>
        <div className={`${s.navDiv} wrapper`}>
          <RiMenu5Fill onClick={() => setIsMenu(true)} className={s.menu} />
          <Link href="/">KeepKaro</Link>
          {keepSaving ? (
            <span className={s.autoKeeping}>
              <RiSave3Line /> Keeping
            </span>
          ) : null}
        </div>
      </nav>
      {isMenu ? <Sidebar ref={sidebarRef} setIsMenu={setIsMenu} /> : null}
    </>
  )
}
