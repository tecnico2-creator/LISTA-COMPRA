import { useMemo, useState } from 'react'
import { SearchBar } from '../components/SearchBar'
import { StoreBadge } from '../components/StoreBadge'
import { useProducts } from '../hooks/useProducts'
import { useShoppingList } from '../hooks/useShoppingList'
import { STORES } from '../utils/stores'
import { formatPrice } from '../utils/price'
import type { StoreId } from '../types'

export function StoreViewPage() {
  const { products, loading, error } = useProducts()
  const { addItem } = useShoppingList()
  const [storeId, setStoreId] = useState<StoreId>(STORES[0].id)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const productsInStore = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products
      .filter((p) => typeof p.prices[storeId] === 'number')
      .filter((p) => !term || p.name.toLowerCase().includes(term))
      .sort((a, b) => (a.prices[storeId] as number) - (b.prices[storeId] as number))
  }, [products, storeId, search])

  async function handleAddToList(productId: string, productName: string, category: string) {
    await addItem({ productId, productName, category, quantity: 1, checked: false })
    setToast(`"${productName}" añadido a la lista`)
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="label mb-2">Elige una tienda</p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {STORES.map((store) => {
            const isActive = store.id === storeId
            return (
              <button
                key={store.id}
                onClick={() => setStoreId(store.id)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium ring-1 ring-inset transition-colors ${
                  isActive
                    ? `${store.bg} ${store.text} ${store.ring}`
                    : 'bg-white text-slate ring-black/10 hover:bg-black/5'
                }`}
              >
                {store.name}
              </button>
            )
          })}
        </div>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Buscar en esta tienda…" />

      {error && (
        <div className="card p-4 text-sm text-amber-800 bg-sand-50 border-sand-200">{error}</div>
      )}

      {!error && loading && <p className="text-sm text-slate">Cargando productos…</p>}

      {!error && !loading && productsInStore.length === 0 && (
        <div className="card p-8 text-center text-slate">
          <p className="font-medium text-ink">Sin productos en esta tienda</p>
          <p className="text-sm mt-1">
            Añade un precio para esta tienda desde la pestaña Productos.
          </p>
        </div>
      )}

      <ul className="space-y-2">
        {productsInStore.map((product) => (
          <li key={product.id} className="card p-3.5 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-ink truncate">{product.name}</p>
              {product.category && <p className="text-xs text-slate truncate">{product.category}</p>}
            </div>
            {product.preferredStore && product.preferredStore !== storeId && (
              <StoreBadge storeId={product.preferredStore} size="sm" />
            )}
            <span className="font-semibold text-ink">{formatPrice(product.prices[storeId])}</span>
            <button
              onClick={() => handleAddToList(product.id, product.name, product.category)}
              className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full bg-blush-100 text-rose-800 hover:bg-blush-200 transition-colors"
              aria-label="Añadir a la lista"
              title="Añadir a la lista"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-ink text-white text-sm px-4 py-2 rounded-full shadow-card z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
