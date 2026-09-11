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
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../firebase'
import type { NewShoppingListItem, ShoppingListItem } from '../types'

const COLLECTION = 'shoppingList'

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false)
      setError(
        'Firebase no está configurado. Añade tus credenciales en el archivo .env (ver .env.example).',
      )
      return
    }

    const q = query(collection(db, COLLECTION), orderBy('addedAt', 'desc'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: ShoppingListItem[] = snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            productId: data.productId ?? '',
            productName: data.productName ?? '',
            category: data.category ?? '',
            quantity: data.quantity ?? 1,
            checked: data.checked ?? false,
            addedAt: data.addedAt?.toMillis?.() ?? Date.now(),
          }
        })
        setItems(list)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Error leyendo la lista de la compra de Firestore', err)
        setError('No se ha podido cargar la lista de la compra.')
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const api = useMemo(
    () => ({
      async addItem(item: NewShoppingListItem) {
        if (!db) throw new Error('Firebase no está configurado')
        await addDoc(collection(db, COLLECTION), {
          ...item,
          addedAt: serverTimestamp(),
        })
      },
      async toggleChecked(id: string, checked: boolean) {
        if (!db) throw new Error('Firebase no está configurado')
        await updateDoc(doc(db, COLLECTION, id), { checked })
      },
      async setQuantity(id: string, quantity: number) {
        if (!db) throw new Error('Firebase no está configurado')
        await updateDoc(doc(db, COLLECTION, id), { quantity: Math.max(1, quantity) })
      },
      async removeItem(id: string) {
        if (!db) throw new Error('Firebase no está configurado')
        await deleteDoc(doc(db, COLLECTION, id))
      },
      async clearChecked(checkedIds: string[]) {
        if (!db) throw new Error('Firebase no está configurado')
        const batch = writeBatch(db)
        checkedIds.forEach((id) => batch.delete(doc(db!, COLLECTION, id)))
        await batch.commit()
      },
    }),
    [],
  )

  return { items, loading, error, ...api }
}
