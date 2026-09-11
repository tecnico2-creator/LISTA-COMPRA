import type { Product } from '../types'
import { formatPrice, getBestPrice } from '../utils/price'
import { StoreBadge } from './StoreBadge'
import { ProductThumb } from './ProductThumb'

interface ProductListRowProps {
  product: Product
  onEdit: () => void
  onDelete: () => void
  onAddToList: () => void
}

export function ProductListRow({ product, onEdit, onDelete, onAddToList }: ProductListRowProps) {
  const best = getBestPrice(product)

  return (
    <div className="card p-3 flex items-center gap-3">
      <ProductThumb photo={product.photo} alt={product.name} size="md" />

      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-ink truncate">{product.name}</h3>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <StoreBadge storeId={best.store} size="sm" />
          <span className="text-sm font-semibold text-ink">{formatPrice(best.price)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onAddToList}
          className="h-9 w-9 flex items-center justify-center rounded-full bg-blush-100 text-rose-800 hover:bg-blush-200 transition-colors"
          aria-label="Añadir a la lista"
          title="Añadir a la lista"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
          </svg>
        </button>
        <button
          onClick={onEdit}
          className="h-9 w-9 flex items-center justify-center rounded-full text-slate hover:bg-black/5"
          aria-label="Editar"
          title="Editar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.5-9.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
            />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="h-9 w-9 flex items-center justify-center rounded-full text-slate hover:bg-rose-50 hover:text-rose-600"
          aria-label="Eliminar"
          title="Eliminar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0-1 12a2 2 0 01-2 2H9a2 2 0 01-2-2L6 7h12z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
