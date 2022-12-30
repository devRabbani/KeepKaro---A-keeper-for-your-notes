import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '../contexts/auth/authContext'
import FullLoading from '../components/fullLoading'
import { useKeepsList } from '../contexts/keepLists'
import s from '../styles/Home.module.css'

export default function Home() {
  const { data, loading } = useKeepsList()

  const router = useRouter()
  const { user } = useAuth()
  const recents = JSON.parse(localStorage.getItem('recents'))

  // useEffect(() => {
  //   if (data?.length) {
  //     router.push('/keep/' + data[0].keepId)
  //   }
  // }, [loading])

  if (loading) {
    return <FullLoading text="Getting Data.." />
  }
  console.log(recents)
  return (
    <div className={`${s.homePage} wrapper`}>
      <h1>Welcome {user?.displayName || 'User'}</h1>
      <h3 className={s.recentlyViewed}>Recently Viewed</h3>
      {recents?.length ? (
        <div className={s.keepLists}>
          {recents.map((keep) => (
            <Link
              className={s.keep}
              key={keep?.keepId}
              href={'/keep/' + keep?.keepId}
            >
              {keep.title}
            </Link>
          ))}
        </div>
      ) : (
        <p className={s.noData}>No Recents data found</p>
      )}
      <h3>Your Keeps</h3>
      {data?.length ? (
        <div className={s.keepLists}>
          {data.map((keep) => (
            <Link
              className={s.keep}
              key={keep?.keepId}
              href={'/keep/' + keep?.keepId}
            >
              {keep.title}
            </Link>
          ))}
        </div>
      ) : (
        <p className={s.noData}>No Keep found try to add one!</p>
      )}
    </div>
  )
}
