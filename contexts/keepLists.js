import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './auth/authContext'
import { db } from '../lib/firebase'

const KeepListsContext = createContext()

export const useKeepsList = () => useContext(KeepListsContext)

export default function KeepListsContextProvider({ children }) {
  const { user, authReady } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsub
    if (authReady && user?.uid) {
      setLoading(true)
      try {
        unsub = onSnapshot(
          query(
            collection(db, 'users', user?.uid, 'keeplists'),
            orderBy('createdAt', 'desc')
          ),
          (snapshot) => {
            if (!snapshot.empty) {
              let list = []
              snapshot.forEach((item) => {
                list.push({ keepId: item.id, ...item.data() })
              })
              setData(list)
            } else {
              setData([])
            }
            setLoading(false)
          }
        )
      } catch (error) {
        console.log(error.message)
        setLoading(false)
      }
    }
    return () => unsub && unsub()
  }, [user?.uid, authReady])

  return (
    <KeepListsContext.Provider value={{ data, loading }}>
      {children}
    </KeepListsContext.Provider>
  )
}
