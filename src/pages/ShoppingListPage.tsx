import { useMemo, useState } from 'react'
import { useShoppingList } from '../hooks/useShoppingList'
import { useProducts } from '../hooks/useProducts'
import { AddStoreModal } from '../components/AddStoreModal'
import { ProductThumb } from '../components/ProductThumb'
import { useStoresContext } from '../context/StoresContext'
import { getBestPrice, formatPrice } from '../utils/price'
import type { Product, ShoppingListItem, StoreId } from '../types'

export function ShoppingListPage() {
  const { items, loading, error, addItem, toggleChecked, setQuantity, removeItem, clearChecked } =
    useShoppingList()
  const { products } = useProducts()
  const { stores, storeMap } = useStoresContext()
  const [query, setQuery] = useState('')
  const [selectedStoreId, setSelectedStoreId] = useState<StoreId | null>(null)
  const [manageOpen, setManageOpen] = useState(false)

  const productById = useMemo(() => {
    const map = new Map<string, Product>()
    for (const p of products) map.set(p.id, p)
    return map
  }, [products])

  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    const existingIds = new Set(items.map((i) => i.productId))
    return products
      .filter((p) => p.name.toLowerCase().includes(term) && !existingIds.has(p.id))
      .slice(0, 6)
  }, [query, products, items])

  const pending = items.filter((i) => !i.checked)
  const checked = items.filter((i) => i.checked)

  /** Precio a mostrar para un artículo, y si es el más barato de todas las tiendas
   * en las que se ha introducido precio para ese producto. */
  function priceForItem(item: ShoppingListItem) {
    const product = productById.get(item.productId)
    if (!product) return { price: null as number | null, store: null as StoreId | null, isCheapest: false }

    if (!selectedStoreId) {
      const best = getBestPrice(product)
      return { price: best.price, store: best.store, isCheapest: true }
    }

    const price =
      typeof product.prices[selectedStoreId] === 'number'
        ? (product.prices[selectedStoreId] as number)
        : null
    const overallBest = getBestPrice(product).price
    const isCheapest = price !== null && price === overallBest
    return { price, store: selectedStoreId, isCheapest }
  }

  /** En modo "Automático" se ven todos los artículos. Al elegir una tienda concreta,
   * solo se ven los artículos de la lista que salen más baratos precisamente en esa
   * tienda (los demás, que son más baratos en otra tienda, se ocultan). */
  const visiblePending = selectedStoreId
    ? pending.filter((item) => priceForItem(item).isCheapest)
    : pending

  const total = useMemo(() => {
    return visiblePending.reduce((sum, item) => {
      const { price } = priceForItem(item)
      return sum + (price ?? 0) * item.quantity
    }, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visiblePending, productById, selectedStoreId])

  async function handleAddFromSearch(product: Product) {
    await addItem({
      productId: product.id,
      productName: product.name,
      category: product.category,
      quantity: 1,
      checked: false,
    })
    setQuery('')
  }

  async function handleAddFreeText() {
    const name = query.trim()
    if (!name) return
    await addItem({ productId: '', productName: name, category: '', quantity: 1, checked: false })
    setQuery('')
  }

  const selectedStore = selectedStoreId ? storeMap[selectedStoreId] : null

  return (
    <div className="space-y-5">
      <div className="relative">
        <input
          className="input"
          placeholder="Añadir producto a la lista…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && suggestions.length === 0) handleAddFreeText()
          }}
        />
        {suggestions.length > 0 && (
          <ul className="card absolute z-20 mt-1 w-full overflow-hidden py-1">
            {suggestions.map((product) => (
              <li key={product.id}>
                <button
                  onClick={() => handleAddFromSearch(product)}
                  className="w-full flex items-center justify-between gap-2 px-3.5 py-2 text-left hover:bg-mint-50 transition-colors"
                >
                  <span className="text-sm text-ink truncate">{product.name}</span>
                  <span className="text-xs text-slate shrink-0">
                    {formatPrice(getBestPrice(product).price)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="label mb-0">¿En qué tienda vas a comprar?</p>
            <button
              onClick={() => setManageOpen(true)}
              className="text-xs font-medium text-slate hover:text-ink underline underline-offset-2"
            >
              Gestionar tiendas
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <button
              onClick={() => setSelectedStoreId(null)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium ring-1 ring-inset transition-colors ${
                selectedStoreId === null
                  ? 'bg-ink text-white ring-ink'
                  : 'bg-white text-slate ring-black/10 hover:bg-black/5'
              }`}
            >
              Automático
            </button>
            {stores.map((store) => {
              const isActive = store.id === selectedStoreId
              return (
                <button
                  key={store.id}
                  onClick={() => setSelectedStoreId(store.id)}
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
            <button
              onClick={() => setManageOpen(true)}
              className="shrink-0 rounded-full px-3.5 py-2 text-sm font-medium bg-white text-slate ring-1 ring-inset ring-black/10 hover:bg-black/5"
              aria-label="Añadir tienda"
              title="Añadir tienda"
            >
              + Tienda
            </button>
          </div>
          {selectedStore && (
            <p className="mt-1.5 text-xs text-slate">
              Solo se muestran los artículos de tu lista que salen más baratos en {selectedStore.name}.
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="card p-4 text-sm text-amber-800 bg-sand-50 border-sand-200">{error}</div>
      )}

      {!error && loading && <p className="text-sm text-slate">Cargando lista…</p>}

      {!error && !loading && items.length === 0 && (
        <div className="card p-8 text-center text-slate">
          <p className="font-medium text-ink">Tu lista está vacía</p>
          <p className="text-sm mt-1">
            Busca un producto arriba o añádelo desde la pestaña Productos o Tiendas.
          </p>
        </div>
      )}

      {!error && !loading && pending.length > 0 && visiblePending.length === 0 && (
        <div className="card p-8 text-center text-slate">
          <p className="font-medium text-ink">Nada más barato en {selectedStore?.name} por ahora</p>
          <p className="text-sm mt-1">
            Ningún artículo pendiente de tu lista tiene aquí el precio más bajo. Prueba con otra
            tienda o revisa los precios del producto.
          </p>
        </div>
      )}

      {visiblePending.length > 0 && (
        <ul className="space-y-2">
          {visiblePending.map((item) => {
            const { price, store } = priceForItem(item)
            return (
              <li key={item.id} className="card p-3.5 flex items-center gap-3">
                <button
                  onClick={() => toggleChecked(item.id, true)}
                  className="h-6 w-6 shrink-0 rounded-full border-2 border-mint-300 hover:bg-mint-100 transition-colors"
                  aria-label="Marcar como comprado"
                />
                <ProductThumb photo={productById.get(item.productId)?.photo} alt={item.productName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink truncate">{item.productName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    {price !== null ? (
                      <>
                        {!selectedStoreId && store && (
                          <span
                            className={`inline-flex items-center rounded-full ${storeMap[store]?.bg} ${storeMap[store]?.text} px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${storeMap[store]?.ring}`}
                          >
                            {storeMap[store]?.name}
                          </span>
                        )}
                        <span className="text-sm font-medium text-emerald-700">
                          {formatPrice(price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-slate italic">Sin precio</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    className="h-7 w-7 rounded-full bg-black/5 hover:bg-black/10 text-ink"
                    onClick={() => setQuantity(item.id, item.quantity - 1)}
                    aria-label="Restar"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-sm">{item.quantity}</span>
                  <button
                    className="h-7 w-7 rounded-full bg-black/5 hover:bg-black/10 text-ink"
                    onClick={() => setQuantity(item.id, item.quantity + 1)}
                    aria-label="Sumar"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full text-slate hover:bg-rose-50 hover:text-rose-600"
                  aria-label="Eliminar"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {visiblePending.length > 0 && (
        <div className="card p-3.5 flex items-center justify-between gap-2">
          <span className="text-sm text-slate">
            {selectedStore ? `Total más barato en ${selectedStore.name}` : 'Total más barato'} (
            {visiblePending.length} {visiblePending.length === 1 ? 'artículo' : 'artículos'})
          </span>
          <span className="text-lg font-semibold text-ink shrink-0">{formatPrice(total)}</span>
        </div>
      )}

      {checked.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate">
              Comprados ({checked.length})
            </p>
            <button
              className="text-xs font-medium text-slate hover:text-ink underline underline-offset-2"
              onClick={() => clearChecked(checked.map((i) => i.id))}
            >
              Vaciar comprados
            </button>
          </div>
          <ul className="space-y-2">
            {checked.map((item) => (
              <li key={item.id} className="card p-3.5 flex items-center gap-3 opacity-60">
                <button
                  onClick={() => toggleChecked(item.id, false)}
                  className="h-6 w-6 shrink-0 rounded-full bg-mint-300 flex items-center justify-center text-emerald-900"
                  aria-label="Marcar como pendiente"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-3.5 w-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <span className="flex-1 text-sm text-ink line-through truncate">{item.productName}</span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full text-slate hover:bg-rose-50 hover:text-rose-600"
                  aria-label="Eliminar"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AddStoreModal open={manageOpen} onClose={() => setManageOpen(false)} />
    </div>
  )
}
