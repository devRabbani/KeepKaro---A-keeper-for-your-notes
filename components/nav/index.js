import Link from 'next/link'
import s from './nav.module.css'
import { RiMenu5Fill, RiSave3Line, RiUploadCloud2Line } from 'react-icons/ri'
import { useEffect, useRef, useState } from 'react'
import Sidebar from './sidebar'
import { useKeepSaving } from '../../contexts/keepSaving'
import { useAuth } from '../../contexts/auth/authContext'

export default function Nav() {
  const [isMenu, setIsMenu] = useState(false)

  const sidebarRef = useRef(null)
  const { keepSaving, keepDone, changeKeepDone } = useKeepSaving()
  const { user } = useAuth()

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

  const status =
    keepSaving || keepDone ? (
      <span
        className={`${s.statusBadge} ${
          keepSaving ? s.statusSaving : s.statusDone
        }`}
      >
        {keepSaving ? <RiUploadCloud2Line /> : <RiSave3Line />}
        {keepSaving ? 'Keeping' : 'Kept'}
      </span>
    ) : null

  return (
    <>
      <nav className={s.nav}>
        <div className={`${s.navDiv} wrapper`}>
          <div className={s.navLeft}>
            <button
              type="button"
              onClick={() => setIsMenu(true)}
              className={s.menuButton}
              aria-label="Open navigation menu"
            >
              <RiMenu5Fill />
            </button>
            <Link href="/" className={s.brand}>
              <span className={s.brandTitle}>KeepKaro</span>
              <span className={s.brandTagline}>Notes kept simple</span>
            </Link>
          </div>
          <div className={s.navRight} aria-live="polite">
            {status}
            {user ? (
              <div className={s.userChip} title={user.displayName}>
                {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            ) : null}
          </div>
        </div>
      </nav>
      <Sidebar ref={sidebarRef} setIsMenu={setIsMenu} isMenu={isMenu} />
    </>
  )
}
