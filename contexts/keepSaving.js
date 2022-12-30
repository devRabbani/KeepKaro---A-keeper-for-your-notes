import { createContext, useContext, useState } from 'react'

const KeepSavingContext = createContext()

export const useKeepSaving = () => useContext(KeepSavingContext)

export default function KeepSavingContextProvider({ children }) {
  const [keepSaving, setKeepSaving] = useState(false)

  const handleKeepSaving = (value) => {
    setKeepSaving(value)
  }

  return (
    <KeepSavingContext.Provider value={{ keepSaving, handleKeepSaving }}>
      {children}
    </KeepSavingContext.Provider>
  )
}
