import { RiArrowLeftSLine, RiLightbulbLine, RiMoonFill } from 'react-icons/ri'
import { useAuth } from '../../contexts/auth/authContext'
import s from './nav.module.css'
import { IoMdLogIn, IoMdLogOut } from 'react-icons/io'
import SidebarContent from '../sidebarContent'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { forwardRef } from 'react'
import Link from 'next/link'

const Sidebar = ({ setIsMenu, isMenu }, ref) => {
  const { user, dispatch } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'light')

  const login = async () => {
    setIsLoading(true)
    const id = toast.loading(<b>Signing in please wait!</b>)
    try {
      const res = await signInWithPopup(auth, new GoogleAuthProvider())
      if (res) {
        toast.success(<b>Welcome {res.user.displayName}</b>, { id })
        dispatch({ type: 'LOGIN', payload: res.user })
        setIsMenu(false)
        setIsLoading(false)
      } else {
        throw new Error('Something went wrong please try again!')
      }
    } catch (error) {
      console.log(error.message)
      toast.error(<b>{error.message}</b>, { id })
      setIsLoading(false)
    }
  }

  const toggleColorMode = () => {
    if (mode === 'light') {
      setMode('dark')
      localStorage.setItem('mode', 'dark')
    } else {
      setMode('light')
      localStorage.setItem('mode', 'light')
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      dispatch({ type: 'LOGOUT' })
      setIsMenu(false)
    } catch (error) {
      console.log(error.message)
      toast.error(<b>{error.message}</b>)
    }
  }

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }, [mode])

  return (
    <div ref={ref} className={`${s.sidebarWrapper} ${isMenu ? 'open' : ''}`}>
      <div className={s.sidebarTop}>
        <Link href="/">
          KeepKaro
          <span>Powered by CanWeBe!</span>
        </Link>
        <button onClick={toggleColorMode} className={s.mode}>
          {mode === 'light' ? <RiMoonFill /> : <RiLightbulbLine />}
        </button>
        <RiArrowLeftSLine
          onClick={() => setIsMenu(false)}
          className={s.menuArrow}
        />
      </div>
      <SidebarContent user={user} setIsMenu={setIsMenu} />
      <div className={s.loginDiv}>
        {user ? (
          <button onClick={logout} className={s.logoutBtn}>
            Logout <IoMdLogOut />
          </button>
        ) : (
          <button disabled={isLoading} onClick={login} className={s.loginBtn}>
            {isLoading ? 'Logging in' : 'Login'} <IoMdLogIn />
          </button>
        )}
      </div>
    </div>
  )
}

export default forwardRef(Sidebar)
