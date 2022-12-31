import { createContext, useContext, useReducer, useState } from 'react'

const KeepSavingContext = createContext()

export const useKeepSaving = () => useContext(KeepSavingContext)

export default function KeepSavingContextProvider({ children }) {
  const [keepSaving, setKeepSaving] = useState(false)

  const changeKeepSaving = (value) => {
    setKeepSaving(value)
  }
  return (
    <KeepSavingContext.Provider value={{ keepSaving, changeKeepSaving }}>
      {children}
    </KeepSavingContext.Provider>
  )
}
