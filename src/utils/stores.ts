import type { StoreId, StoreInfo } from '../types'

export const STORES: StoreInfo[] = [
  { id: 'mercadona', name: 'Mercadona', bg: 'bg-mint-100', text: 'text-emerald-800', ring: 'ring-mint-300' },
  { id: 'dia', name: 'Dia', bg: 'bg-sky-100', text: 'text-sky-800', ring: 'ring-sky-300' },
  { id: 'consum', name: 'Consum', bg: 'bg-blush-100', text: 'text-rose-800', ring: 'ring-blush-300' },
  { id: 'lidl', name: 'Lidl', bg: 'bg-sand-100', text: 'text-amber-800', ring: 'ring-sand-300' },
  { id: 'aldi', name: 'Aldi', bg: 'bg-lavender-100', text: 'text-violet-800', ring: 'ring-lavender-300' },
  { id: 'spar', name: 'Spar', bg: 'bg-mint-100', text: 'text-teal-800', ring: 'ring-mint-300' },
  { id: 'cash_lesco', name: 'Cash Lesco', bg: 'bg-sand-100', text: 'text-orange-800', ring: 'ring-sand-300' },
  { id: 'cash_solano', name: 'Cash Solano', bg: 'bg-blush-100', text: 'text-pink-800', ring: 'ring-blush-300' },
]

export const STORE_MAP: Record<StoreId, StoreInfo> = STORES.reduce(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {} as Record<StoreId, StoreInfo>,
)

export function storeName(id: StoreId | null | undefined): string {
  if (!id) return '—'
  return STORE_MAP[id]?.name ?? id
}
