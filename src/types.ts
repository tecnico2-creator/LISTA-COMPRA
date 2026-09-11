/**
 * Identificador de una tienda. Las 8 tiendas iniciales tienen un id fijo (ver
 * utils/stores.ts), y las tiendas que el usuario añada desde la app tienen un id
 * generado por Firestore. En ambos casos es simplemente un string.
 */
export type StoreId = string

export interface StoreInfo {
  id: StoreId
  name: string
  /** Tailwind color classes used for badges/pills for this store */
  bg: string
  text: string
  ring: string
  /** true para las tiendas iniciales, que no se pueden borrar */
  isDefault?: boolean
}

export type PriceMap = Partial<Record<StoreId, number>>

export interface Product {
  id: string
  name: string
  category: string
  /** Precio introducido manualmente para cada tienda (EUR) */
  prices: PriceMap
  /** Tienda preferida del usuario, o null para usar siempre el precio más bajo */
  preferredStore: StoreId | null
  /** Foto del producto como data URL (base64), ya redimensionada y comprimida. '' si no tiene. */
  photo: string
  createdAt?: number
  updatedAt?: number
}

export type NewProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

export interface ShoppingListItem {
  id: string
  productId: string
  productName: string
  category: string
  quantity: number
  checked: boolean
  addedAt: number
}

export type NewShoppingListItem = Omit<ShoppingListItem, 'id' | 'addedAt'>

export interface BestPrice {
  store: StoreId | null
  price: number | null
  isPreferred: boolean
}
