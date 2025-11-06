import { onAuthStateChanged } from 'firebase/auth'
import { createContext, useContext, useEffect, useReducer } from 'react'
import Loading from '../../components/loading'
import { auth } from '../../lib/firebase'
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
    return <Loading text="KeepKaro" full/>
  }
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
