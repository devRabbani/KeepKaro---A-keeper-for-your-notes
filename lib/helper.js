import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
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

// Update Content
export const editContent = async (keepId, content) => {
  const docRef = doc(db, 'keeps', keepId)
  await updateDoc(docRef, {
    content,
  })
}

// Update title
export const editTitle = async (keepId, uid, title) => {
  const keepRef = doc(db, 'keeps', keepId)
  const keepsListRef = doc(db, 'users', uid, 'keeplists', keepId)
  const batch = writeBatch(db)
  batch.update(keepRef, { title })
  batch.update(keepsListRef, { title })
  await batch.commit()
}

// Share keep
export const shareKeep = async (keepId, title) => {
  const shareData = {
    title: 'Check my Keep on KeepKaro',
    text: title,
    url: 'https://keepkaro.vercel.app/keep/' + keepId,
  }
  if (navigator.canShare(shareData)) {
    await navigator.share(shareData)
  } else {
    alert('Not shareable')
  }
}

// Get keep Data
export const getKeepData = async (keepId) => {
  const docRef = doc(db, 'keeps', keepId)
  const snapshot = await getDoc(docRef)
  if (snapshot.exists()) {
    return snapshot.data()
  }
}
