import { useMemo, useState } from 'react'
import { SearchBar } from '../components/SearchBar'
import { ProductCard } from '../components/ProductCard'
import { ProductListRow } from '../components/ProductListRow'
import { Modal } from '../components/Modal'
import { ProductForm } from '../components/ProductForm'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useProducts } from '../hooks/useProducts'
import { useShoppingList } from '../hooks/useShoppingList'
import type { NewProduct, Product } from '../types'

type ViewMode = 'grid' | 'list'

const VIEW_MODE_KEY = 'lista-compra:products-view-mode'

function loadViewMode(): ViewMode {
  try {
    const saved = localStorage.getItem(VIEW_MODE_KEY)
    return saved === 'list' ? 'list' : 'grid'
  } catch {
    return 'grid'
  }
}

export function ProductsPage() {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useProducts()
  const { addItem } = useShoppingList()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>(loadViewMode)

  function changeViewMode(mode: ViewMode) {
    setViewMode(mode)
    try {
      localStorage.setItem(VIEW_MODE_KEY, mode)
    } catch {
      // localStorage puede no estar disponible (modo privado, etc.); no pasa nada, se pierde
      // la preferencia entre sesiones pero la app sigue funcionando.
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return products
    return products.filter(
      (p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term),
    )
  }, [products, search])

  function openNew() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(product: Product) {
    setEditing(product)
    setFormOpen(true)
  }

  async function handleSubmit(data: NewProduct) {
    if (editing) {
      await updateProduct(editing.id, data)
    } else {
      await addProduct(data)
    }
    setFormOpen(false)
    setEditing(null)
  }

  async function handleAddToList(product: Product) {
    await addItem({
      productId: product.id,
      productName: product.name,
      category: product.category,
      quantity: 1,
      checked: false,
    })
    setToast(`"${product.name}" añadido a la lista`)
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="flex shrink-0 rounded-full bg-white ring-1 ring-inset ring-black/10 p-0.5">
          <button
            onClick={() => changeViewMode('grid')}
            className={`h-8 w-8 flex items-center justify-center rounded-full transition-colors ${
              viewMode === 'grid' ? 'bg-mint-200 text-emerald-900' : 'text-slate hover:bg-black/5'
            }`}
            aria-label="Ver en cuadrícula"
            title="Ver en cuadrícula"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
              <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
              <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
              <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
            </svg>
          </button>
          <button
            onClick={() => changeViewMode('list')}
            className={`h-8 w-8 flex items-center justify-center rounded-full transition-colors ${
              viewMode === 'list' ? 'bg-mint-200 text-emerald-900' : 'text-slate hover:bg-black/5'
            }`}
            aria-label="Ver en lista"
            title="Ver en lista"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <button className="btn-primary shrink-0" onClick={openNew}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
          </svg>
          Nuevo
        </button>
      </div>

      {error && (
        <div className="card p-4 text-sm text-amber-800 bg-sand-50 border-sand-200">{error}</div>
      )}

      {!error && loading && <p className="text-sm text-slate">Cargando productos…</p>}

      {!error && !loading && filtered.length === 0 && (
        <div className="card p-8 text-center text-slate">
          <p className="font-medium text-ink">
            {products.length === 0 ? 'Todavía no hay productos' : 'No se han encontrado productos'}
          </p>
          <p className="text-sm mt-1">
            {products.length === 0
              ? 'Añade tu primer producto y sus precios por tienda.'
              : 'Prueba con otro término de búsqueda.'}
          </p>
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => openEdit(product)}
              onDelete={() => setPendingDelete(product)}
              onAddToList={() => handleAddToList(product)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((product) => (
            <ProductListRow
              key={product.id}
              product={product}
              onEdit={() => openEdit(product)}
              onDelete={() => setPendingDelete(product)}
              onAddToList={() => handleAddToList(product)}
            />
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        title={editing ? 'Editar producto' : 'Nuevo producto'}
        onClose={() => setFormOpen(false)}
      >
        <ProductForm
          initial={editing}
          onCancel={() => setFormOpen(false)}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Eliminar producto"
        message={`¿Seguro que quieres eliminar "${pendingDelete?.name}"? Esta acción no se puede deshacer.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (pendingDelete) await deleteProduct(pendingDelete.id)
          setPendingDelete(null)
        }}
      />

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-ink text-white text-sm px-4 py-2 rounded-full shadow-card z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
