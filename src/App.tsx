import { useState } from 'react'
import { Layout, type PageId } from './components/Layout'
import { ShoppingListPage } from './pages/ShoppingListPage'
import { ProductsPage } from './pages/ProductsPage'
import { StoreViewPage } from './pages/StoreViewPage'

function App() {
  const [page, setPage] = useState<PageId>('lista')

  return (
    <Layout active={page} onNavigate={setPage}>
      {page === 'lista' && <ShoppingListPage />}
      {page === 'productos' && <ProductsPage />}
      {page === 'tiendas' && <StoreViewPage />}
    </Layout>
  )
}

export default App
