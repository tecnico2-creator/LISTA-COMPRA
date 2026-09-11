import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { StoreInfo } from '../types'
import { CUSTOM_STORE_PALETTE, DEFAULT_STORES, buildStoreMap } from '../utils/stores'
import { useCustomStores } from '../hooks/useCustomStores'

interface StoresContextValue {
  /** Tiendas por defecto + tiendas añadidas por el usuario, en ese orden */
  stores: StoreInfo[]
  storeMap: Record<string, StoreInfo>
  loading: boolean
  addStore: (name: string) => Promise<void>
  deleteStore: (id: string) => Promise<void>
}

const StoresContext = createContext<StoresContextValue | null>(null)

export function StoresProvider({ children }: { children: ReactNode }) {
  const { customStores, loading, addCustomStore, deleteCustomStore } = useCustomStores()

  const stores = useMemo(() => [...DEFAULT_STORES, ...customStores], [customStores])
  const storeMap = useMemo(() => buildStoreMap(stores), [stores])

  const value = useMemo<StoresContextValue>(
    () => ({
      stores,
      storeMap,
      loading,
      async addStore(name: string) {
        const trimmed = name.trim()
        if (!trimmed) return
        const palette = CUSTOM_STORE_PALETTE[customStores.length % CUSTOM_STORE_PALETTE.length]
        await addCustomStore({ name: trimmed, ...palette })
      },
      async deleteStore(id: string) {
        await deleteCustomStore(id)
      },
    }),
    [stores, storeMap, loading, customStores.length, addCustomStore, deleteCustomStore],
  )

  return <StoresContext.Provider value={value}>{children}</StoresContext.Provider>
}

export function useStoresContext(): StoresContextValue {
  const ctx = useContext(StoresContext)
  if (!ctx) throw new Error('useStoresContext debe usarse dentro de <StoresProvider>')
  return ctx
}
