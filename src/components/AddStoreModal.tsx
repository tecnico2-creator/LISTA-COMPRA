import { useState, type FormEvent } from 'react'
import { Modal } from './Modal'
import { useStoresContext } from '../context/StoresContext'

interface AddStoreModalProps {
  open: boolean
  onClose: () => void
}

export function AddStoreModal({ open, onClose }: AddStoreModalProps) {
  const { stores, addStore, deleteStore } = useStoresContext()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const trimmed = name.trim()
    if (!trimmed) return
    if (stores.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Ya tienes una tienda con ese nombre.')
      return
    }
    setSaving(true)
    try {
      await addStore(trimmed)
      setName('')
    } catch (err) {
      console.error(err)
      setError('No se ha podido añadir la tienda.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title="Tus tiendas" onClose={onClose}>
      <div className="space-y-4">
        <ul className="space-y-1.5 max-h-64 overflow-y-auto">
          {stores.map((store) => (
            <li
              key={store.id}
              className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 bg-cream"
            >
              <span
                className={`inline-flex items-center rounded-full ${store.bg} ${store.text} px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${store.ring}`}
              >
                {store.name}
              </span>
              {store.isDefault ? (
                <span className="text-[11px] text-slate">inicial</span>
              ) : (
                <button
                  onClick={() => deleteStore(store.id)}
                  className="h-7 w-7 flex items-center justify-center rounded-full text-slate hover:bg-rose-50 hover:text-rose-600"
                  aria-label={`Eliminar ${store.name}`}
                  title="Eliminar tienda"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </li>
          ))}
        </ul>

        <form onSubmit={handleAdd} className="flex items-end gap-2 pt-2 border-t border-black/5">
          <div className="flex-1">
            <label className="label" htmlFor="new-store-name">
              Añadir otra tienda
            </label>
            <input
              id="new-store-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Carrefour"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={saving || !name.trim()}>
            Añadir
          </button>
        </form>
        {error && <p className="text-sm text-rose-600">{error}</p>}
      </div>
    </Modal>
  )
}
