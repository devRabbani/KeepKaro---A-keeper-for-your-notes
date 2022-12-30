import { useEffect } from 'react'

export default function useAddRecents(title, keepId) {
  useEffect(() => {
    const handleAdd = () => {
      let recents = localStorage.getItem('recents')
      if (recents) {
        recents = JSON.parse(recents)
      } else {
        recents = []
      }
      const index = recents.findIndex((item) => item.keepId === keepId)
      if (index > -1) {
        recents.splice(index, 1)
      }
      title && recents.unshift({ title, keepId })

      if (recents.length > 3) {
        recents.pop()
      }
      localStorage.setItem('recents', JSON.stringify(recents))
    }
    handleAdd()
  }, [keepId, title])
}
