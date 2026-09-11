import { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../firebase'
import type { StoreInfo } from '../types'

const COLLECTION = 'stores'

export function useCustomStores() {
  const [customStores, setCustomStores] = useState<StoreInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false)
      return
    }

    const q = query(collection(db, COLLECTION), orderBy('createdAt'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: StoreInfo[] = snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            name: data.name ?? '',
            bg: data.bg ?? 'bg-mint-100',
            text: data.text ?? 'text-emerald-800',
            ring: data.ring ?? 'ring-mint-300',
            isDefault: false,
          }
        })
        setCustomStores(items)
        setLoading(false)
      },
      (err) => {
        console.error('Error leyendo tiendas personalizadas de Firestore', err)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const api = useMemo(
    () => ({
      async addCustomStore(store: Pick<StoreInfo, 'name' | 'bg' | 'text' | 'ring'>) {
        if (!db) throw new Error('Firebase no está configurado')
        await addDoc(collection(db, COLLECTION), {
          ...store,
          createdAt: serverTimestamp(),
        })
      },
      async deleteCustomStore(id: string) {
        if (!db) throw new Error('Firebase no está configurado')
        await deleteDoc(doc(db, COLLECTION, id))
      },
    }),
    [],
  )

  return { customStores, loading, ...api }
}
