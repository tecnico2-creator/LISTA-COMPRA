import type { StoreId, StoreInfo } from '../types'

/** Las 8 tiendas iniciales. Tienen un id fijo (se usa como clave en los precios de
 * cada producto) y no se pueden borrar desde la app. */
export const DEFAULT_STORES: StoreInfo[] = [
  { id: 'mercadona', name: 'Mercadona', bg: 'bg-mint-100', text: 'text-emerald-800', ring: 'ring-mint-300', isDefault: true },
  { id: 'dia', name: 'Dia', bg: 'bg-sky-100', text: 'text-sky-800', ring: 'ring-sky-300', isDefault: true },
  { id: 'consum', name: 'Consum', bg: 'bg-blush-100', text: 'text-rose-800', ring: 'ring-blush-300', isDefault: true },
  { id: 'lidl', name: 'Lidl', bg: 'bg-sand-100', text: 'text-amber-800', ring: 'ring-sand-300', isDefault: true },
  { id: 'aldi', name: 'Aldi', bg: 'bg-lavender-100', text: 'text-violet-800', ring: 'ring-lavender-300', isDefault: true },
  { id: 'spar', name: 'Spar', bg: 'bg-mint-100', text: 'text-teal-800', ring: 'ring-mint-300', isDefault: true },
  { id: 'cash_lesco', name: 'Cash Lesco', bg: 'bg-sand-100', text: 'text-orange-800', ring: 'ring-sand-300', isDefault: true },
  { id: 'cash_solano', name: 'Cash Solano', bg: 'bg-blush-100', text: 'text-pink-800', ring: 'ring-blush-300', isDefault: true },
]

/** Paleta de colores pastel que se reparte, por turnos, a las tiendas que el
 * usuario vaya añadiendo desde la app. */
export const CUSTOM_STORE_PALETTE: Array<Pick<StoreInfo, 'bg' | 'text' | 'ring'>> = [
  { bg: 'bg-mint-100', text: 'text-emerald-800', ring: 'ring-mint-300' },
  { bg: 'bg-sky-100', text: 'text-sky-800', ring: 'ring-sky-300' },
  { bg: 'bg-blush-100', text: 'text-rose-800', ring: 'ring-blush-300' },
  { bg: 'bg-sand-100', text: 'text-amber-800', ring: 'ring-sand-300' },
  { bg: 'bg-lavender-100', text: 'text-violet-800', ring: 'ring-lavender-300' },
]

export function buildStoreMap(stores: StoreInfo[]): Record<StoreId, StoreInfo> {
  return stores.reduce(
    (acc, s) => ({ ...acc, [s.id]: s }),
    {} as Record<StoreId, StoreInfo>,
  )
}
