import { createContext, useContext, useReducer, useState } from 'react'

const KeepSavingContext = createContext()

export const useKeepSaving = () => useContext(KeepSavingContext)

const reducer = (state, action) => {
  switch (action.type) {
    case 'SAVING':
      return { ...state, keepSaving: true }
    case 'DONE':
      return { ...state, keepSaving: false }
    case 'TOGGLE':
      return { ...state, edit: !state.edit }
    default:
      return state
  }
}

export default function KeepSavingContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    keepSaving: false,
    edit: true,
  })

  return (
    <KeepSavingContext.Provider value={{ ...state, dispatch }}>
      {children}
    </KeepSavingContext.Provider>
  )
}
