import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useKeepsList } from '../contexts/keepLists'
import s from '../styles/Home.module.css'

export default function Home() {
  const { data, loading } = useKeepsList()

  const router = useRouter()

  // useEffect(() => {
  //   if (data?.length) {
  //     router.push('/keep/' + data[0].keepId)
  //   }
  // }, [loading])

  return (
    <div className={s.homePage}>
      {loading ? (
        <p>Loading...</p>
      ) : data?.length < 1 ? (
        <p>No keeps found try to add new Keep</p>
      ) : (
        <p>Select keep from menu</p>
      )}
    </div>
  )
}
