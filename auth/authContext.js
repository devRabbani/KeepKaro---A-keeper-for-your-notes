import { onAuthStateChanged } from 'firebase/auth'
import { createContext, useContext, useEffect, useReducer } from 'react'
import FullLoading from '../components/fullLoading'
import { auth } from '../lib/firebase'
import { AuthReducer } from './authReducer'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

const INITIAL_STATE = {
  user: null,
  authReady: false,
}

export default function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (authUser) => [
      dispatch({ type: 'AUTHREADY', payload: authUser }),
    ])
    return () => unsub()
  }, [])

  if (!state.authReady) {
    return <FullLoading />
  }
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
