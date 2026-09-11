import type { StoreId } from '../types'
import { STORE_MAP } from '../utils/stores'

export function StoreBadge({ storeId, size = 'md' }: { storeId: StoreId | null; size?: 'sm' | 'md' }) {
  if (!storeId) {
    return (
      <span className="inline-flex items-center rounded-full bg-black/5 text-slate px-2.5 py-1 text-xs font-medium">
        Sin tienda
      </span>
    )
  }

  const store = STORE_MAP[storeId]
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center rounded-full ${store.bg} ${store.text} ${padding} font-medium ring-1 ring-inset ${store.ring}`}
    >
      {store.name}
    </span>
  )
}
