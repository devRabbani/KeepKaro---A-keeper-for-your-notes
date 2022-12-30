import { doc, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore'
import { db } from './firebase'

// Creating new Keeplists
export const createKeep = async (keepId, uid, displayName) => {
  const keeplistRef = doc(db, 'users', uid, 'keeplists', keepId)
  const keepRef = doc(db, 'keeps', keepId)
  const batch = writeBatch(db)
  batch.set(keeplistRef, {
    title: 'New Title',
    createdAt: serverTimestamp(),
  })

  batch.set(keepRef, {
    title: 'New Title',
    content: '',
    uid,
    name: displayName,
  })

  await batch.commit()
}

// Delete Keep
export const deleteKeep = async (keepId, uid) => {
  const keeplistRef = doc(db, 'users', uid, 'keeplists', keepId)
  const keepRef = doc(db, 'keeps', keepId)
  const batch = writeBatch(db)
  batch.delete(keeplistRef)
  batch.delete(keepRef)
  await batch.commit()
}
