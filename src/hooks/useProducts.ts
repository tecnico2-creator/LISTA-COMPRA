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
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../firebase'
import type { NewProduct, Product } from '../types'

const COLLECTION = 'products'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
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

    const q = query(collection(db, COLLECTION), orderBy('name'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Product[] = snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            name: data.name ?? '',
            category: data.category ?? '',
            prices: data.prices ?? {},
            preferredStore: data.preferredStore ?? null,
            photo: data.photo ?? '',
            createdAt: data.createdAt?.toMillis?.() ?? undefined,
            updatedAt: data.updatedAt?.toMillis?.() ?? undefined,
          }
        })
        setProducts(items)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Error leyendo productos de Firestore', err)
        setError('No se han podido cargar los productos. Revisa tu conexión o la configuración de Firebase.')
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const api = useMemo(
    () => ({
      async addProduct(product: NewProduct) {
        if (!db) throw new Error('Firebase no está configurado')
        await addDoc(collection(db, COLLECTION), {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      },
      async updateProduct(id: string, product: Partial<NewProduct>) {
        if (!db) throw new Error('Firebase no está configurado')
        await updateDoc(doc(db, COLLECTION, id), {
          ...product,
          updatedAt: serverTimestamp(),
        })
      },
      async deleteProduct(id: string) {
        if (!db) throw new Error('Firebase no está configurado')
        await deleteDoc(doc(db, COLLECTION, id))
      },
    }),
    [],
  )

  return { products, loading, error, ...api }
}
