import { useMemo, useState } from 'react'
import { useShoppingList } from '../hooks/useShoppingList'
import { useProducts } from '../hooks/useProducts'
import { StoreBadge } from '../components/StoreBadge'
import { getBestPrice, formatPrice } from '../utils/price'
import type { Product } from '../types'

export function ShoppingListPage() {
  const { items, loading, error, addItem, toggleChecked, setQuantity, removeItem, clearChecked } =
    useShoppingList()
  const { products } = useProducts()
  const [query, setQuery] = useState('')

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

  const total = useMemo(() => {
    return pending.reduce((sum, item) => {
      const product = productById.get(item.productId)
      const price = product ? getBestPrice(product).price : null
      return sum + (price ?? 0) * item.quantity
    }, 0)
  }, [pending, productById])

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

      {pending.length > 0 && (
        <div className="card p-3.5 flex items-center justify-between">
          <span className="text-sm text-slate">Total estimado ({pending.length} artículos)</span>
          <span className="text-lg font-semibold text-ink">{formatPrice(total)}</span>
        </div>
      )}

      {pending.length > 0 && (
        <ul className="space-y-2">
          {pending.map((item) => {
            const product = productById.get(item.productId)
            const best = product ? getBestPrice(product) : null
            return (
              <li key={item.id} className="card p-3.5 flex items-center gap-3">
                <button
                  onClick={() => toggleChecked(item.id, true)}
                  className="h-6 w-6 shrink-0 rounded-full border-2 border-mint-300 hover:bg-mint-100 transition-colors"
                  aria-label="Marcar como comprado"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink truncate">{item.productName}</p>
                  {best && best.price !== null && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <StoreBadge storeId={best.store} size="sm" />
                      <span className="text-xs text-slate">{formatPrice(best.price)}</span>
                    </div>
                  )}
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
    </div>
  )
}
