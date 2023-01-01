import { createContext, useContext, useReducer, useState } from 'react'

const KeepSavingContext = createContext()

export const useKeepSaving = () => useContext(KeepSavingContext)

export default function KeepSavingContextProvider({ children }) {
  const [keepSaving, setKeepSaving] = useState(false)
  const [keepDone, setKeepDone] = useState(false)

  const changeKeepDone = () => {
    setKeepDone(false)
  }
  const changeKeepSaving = (value) => {
    if (value) {
      setKeepSaving(value)
    } else {
      setKeepSaving(value)
      setKeepDone(true)
    }
  }
  return (
    <KeepSavingContext.Provider
      value={{ keepSaving, keepDone, changeKeepDone, changeKeepSaving }}
    >
      {children}
    </KeepSavingContext.Provider>
  )
}
