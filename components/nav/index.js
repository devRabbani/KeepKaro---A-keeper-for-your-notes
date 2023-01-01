import Link from 'next/link'
import s from './nav.module.css'
import { RiMenu5Fill, RiSave3Line, RiUploadCloud2Line } from 'react-icons/ri'
import { useEffect, useRef, useState } from 'react'
import Sidebar from './sidebar'
import { useKeepSaving } from '../../contexts/keepSaving'

export default function Nav() {
  const [isMenu, setIsMenu] = useState(false)

  const sidebarRef = useRef(null)
  const { keepSaving, keepDone, changeKeepDone } = useKeepSaving()

  useEffect(() => {
    const handler = (e) => {
      if (!sidebarRef?.current?.contains(e.target)) {
        setIsMenu(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Check for Keep Save Done
  useEffect(() => {
    let tracker
    if (keepDone) {
      tracker = setTimeout(() => changeKeepDone(), 2000)
    }

    return () => tracker && clearTimeout(tracker)
  }, [keepDone])

  return (
    <>
      <nav className={s.nav}>
        <div className={`${s.navDiv} wrapper`}>
          <RiMenu5Fill onClick={() => setIsMenu(true)} className={s.menu} />
          <Link href="/">KeepKaro</Link>
          {keepSaving ? (
            <span className={s.autoKeeping}>
              <RiUploadCloud2Line /> Keeping
            </span>
          ) : keepDone ? (
            <span className={s.autoKeeping}>
              <RiSave3Line />
              Kept
            </span>
          ) : null}
        </div>
      </nav>
      <Sidebar ref={sidebarRef} setIsMenu={setIsMenu} isMenu={isMenu} />
    </>
  )
}
