import type { Product } from '../types'
import { formatPrice, getBestPrice } from '../utils/price'
import { StoreBadge } from './StoreBadge'
import { ProductThumb } from './ProductThumb'

interface ProductCardProps {
  product: Product
  onEdit: () => void
  onDelete: () => void
  onAddToList: () => void
}

export function ProductCard({ product, onEdit, onDelete, onAddToList }: ProductCardProps) {
  const best = getBestPrice(product)
  const priceCount = Object.keys(product.prices).length

  return (
    <div className="card p-4 flex flex-col gap-3">
      {product.photo && <ProductThumb photo={product.photo} alt={product.name} size="lg" />}

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-medium text-ink truncate">{product.name}</h3>
          {product.category && <p className="text-xs text-slate truncate">{product.category}</p>}
        </div>
        <button
          onClick={onAddToList}
          className="shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-blush-100 text-rose-800 hover:bg-blush-200 transition-colors"
          aria-label="Añadir a la lista"
          title="Añadir a la lista"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <StoreBadge storeId={best.store} />
        <span className="text-lg font-semibold text-ink">{formatPrice(best.price)}</span>
        {best.isPreferred && (
          <span className="text-[11px] text-slate">preferida</span>
        )}
      </div>

      <p className="text-xs text-slate">
        {priceCount === 0
          ? 'Sin precios todavía'
          : `${priceCount} ${priceCount === 1 ? 'tienda con precio' : 'tiendas con precio'}`}
      </p>

      <div className="flex justify-end gap-2 pt-1 border-t border-black/5 mt-1">
        <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={onEdit}>
          Editar
        </button>
        <button className="btn-danger !px-3 !py-1.5 text-xs" onClick={onDelete}>
          Eliminar
        </button>
      </div>
    </div>
  )
}
