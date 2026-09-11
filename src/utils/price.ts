import type { BestPrice, Product } from '../types'

/**
 * Calcula el precio a mostrar para un producto:
 * - Si el usuario ha marcado una tienda preferida Y hay precio para esa tienda, se usa ese.
 * - Si no, se usa el precio más bajo entre todas las tiendas con precio introducido.
 * - Si no hay ningún precio introducido, no hay precio.
 */
export function getBestPrice(product: Pick<Product, 'prices' | 'preferredStore'>): BestPrice {
  const { prices, preferredStore } = product

  if (preferredStore && typeof prices[preferredStore] === 'number') {
    return { store: preferredStore, price: prices[preferredStore] as number, isPreferred: true }
  }

  let bestStore: BestPrice['store'] = null
  let bestPrice: number | null = null

  for (const [store, price] of Object.entries(prices)) {
    if (typeof price !== 'number' || Number.isNaN(price)) continue
    if (bestPrice === null || price < bestPrice) {
      bestPrice = price
      bestStore = store as BestPrice['store']
    }
  }

  return { store: bestStore, price: bestPrice, isPreferred: false }
}

export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return 'Sin precio'
  return value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}
