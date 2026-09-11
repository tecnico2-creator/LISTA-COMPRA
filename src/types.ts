export type StoreId =
  | 'mercadona'
  | 'dia'
  | 'consum'
  | 'lidl'
  | 'aldi'
  | 'spar'
  | 'cash_lesco'
  | 'cash_solano'

export interface StoreInfo {
  id: StoreId
  name: string
  /** Tailwind color classes used for badges/pills for this store */
  bg: string
  text: string
  ring: string
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
