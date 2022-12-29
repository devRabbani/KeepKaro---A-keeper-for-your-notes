import { RiCloseFill } from 'react-icons/ri'
import { useAuth } from '../../auth/authContext'
import s from './nav.module.css'
import { IoMdLogOut } from 'react-icons/io'
import SidebarContent from '../sidebarContent'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from '../../lib/firebase'

export default function Sidebar({ setIsMenu }) {
  const { user, dispatch } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const login = async () => {
    setIsLoading(true)
    const id = toast.loading(<b>Signing in please wait!</b>)
    try {
      const res = await signInWithPopup(auth, new GoogleAuthProvider())
      if (res) {
        toast.success(<b>Welcome {res.user.displayName}</b>, { id })
        dispatch({ type: 'LOGIN', payload: res.user })
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

  const logout = async () => {
    try {
      await signOut(auth)
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      console.log(error.message)
      toast.error(<b>{error.message}</b>)
    }
  }

  return (
    <div className={s.sidebarWrapper}>
      <div className={s.sidebarTop}>
        <p>
          KeepKaro
          <span>Powered by CanWeBe!</span>
        </p>
        <RiCloseFill onClick={() => setIsMenu(false)} />
      </div>
      <SidebarContent user={user} />
      <div className={s.loginDiv}>
        {user ? (
          <div className={s.userDiv}>
            <p>@{user?.displayName}</p>
            <IoMdLogOut onClick={logout} />
          </div>
        ) : (
          <button disabled={isLoading} onClick={login} className={s.loginBtn}>
            {isLoading ? 'Logging in' : 'Login'}
          </button>
        )}
      </div>
    </div>
  )
}
