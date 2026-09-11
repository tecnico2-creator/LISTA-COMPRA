import { useState, type FormEvent } from 'react'
import type { NewProduct, Product, StoreId, StoreInfo } from '../types'
import { useStoresContext } from '../context/StoresContext'
import { ImagePicker } from './ImagePicker'

interface ProductFormProps {
  initial?: Product | null
  onCancel: () => void
  onSubmit: (product: NewProduct) => Promise<void>
}

function emptyPrices(stores: StoreInfo[]): Partial<Record<StoreId, string>> {
  return stores.reduce((acc, s) => ({ ...acc, [s.id]: '' }), {} as Partial<Record<StoreId, string>>)
}

export function ProductForm({ initial, onCancel, onSubmit }: ProductFormProps) {
  const { stores } = useStoresContext()
  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [preferredStore, setPreferredStore] = useState<StoreId | null>(initial?.preferredStore ?? null)
  const [photo, setPhoto] = useState(initial?.photo ?? '')
  const [priceInputs, setPriceInputs] = useState<Partial<Record<StoreId, string>>>(() => {
    if (!initial) return emptyPrices(stores)
    const p = emptyPrices(stores)
    for (const s of stores) {
      const v = initial.prices[s.id]
      p[s.id] = typeof v === 'number' ? String(v) : ''
    }
    return p
  })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)

    const trimmedName = name.trim()
    if (!trimmedName) {
      setFormError('Ponle un nombre al producto.')
      return
    }

    const prices: Record<string, number> = {}
    for (const s of stores) {
      const raw = priceInputs[s.id]
      if (raw === undefined || raw === '') continue
      const num = Number(raw.replace(',', '.'))
      if (Number.isNaN(num) || num < 0) {
        setFormError(`El precio de ${s.name} no es válido.`)
        return
      }
      prices[s.id] = Math.round(num * 100) / 100
    }

    setSaving(true)
    try {
      await onSubmit({
        name: trimmedName,
        category: category.trim(),
        prices,
        preferredStore,
        photo,
      })
    } catch (err) {
      console.error(err)
      setFormError('No se ha podido guardar el producto. Inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="product-name">
          Nombre del producto
        </label>
        <input
          id="product-name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Leche entera 1L"
          autoFocus
        />
      </div>

      <div>
        <label className="label" htmlFor="product-category">
          Categoría (opcional)
        </label>
        <input
          id="product-category"
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Ej. Lácteos"
        />
      </div>

      <ImagePicker value={photo} onChange={setPhoto} />

      <div>
        <span className="label">Precios por tienda (€)</span>
        <div className="grid grid-cols-2 gap-3">
          {stores.map((store) => (
            <div key={store.id}>
              <label htmlFor={`price-${store.id}`} className="text-xs text-slate mb-1 block">
                {store.name}
              </label>
              <input
                id={`price-${store.id}`}
                className="input"
                inputMode="decimal"
                placeholder="0,00"
                value={priceInputs[store.id] ?? ''}
                onChange={(e) =>
                  setPriceInputs((prev) => ({ ...prev, [store.id]: e.target.value }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="preferred-store">
          Tienda preferida
        </label>
        <select
          id="preferred-store"
          className="input"
          value={preferredStore ?? ''}
          onChange={(e) => setPreferredStore((e.target.value || null) as StoreId | null)}
        >
          <option value="">Automático (precio más bajo)</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-slate">
          Si eliges una tienda, se mostrará siempre su precio (aunque no sea el más bajo). Si no, se
          usará automáticamente el precio más barato disponible.
        </p>
      </div>

      {formError && <p className="text-sm text-rose-600">{formError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-ghost" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Guardando…' : initial ? 'Guardar cambios' : 'Añadir producto'}
        </button>
      </div>
    </form>
  )
}
