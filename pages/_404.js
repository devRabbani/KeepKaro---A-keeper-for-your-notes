import { CONSTANTS } from '@firebase/util'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    const tracker = setTimeout(() => {
      router.push('/')
    }, 2700)

    return () => clearTimeout(tracker)
  }, [])

  return (
    <div className="wrapper notfound">
      <h3>This page does not exist in KeepKaro</h3>
      <Link href="/">Go back to Home</Link>
    </div>
  )
}
