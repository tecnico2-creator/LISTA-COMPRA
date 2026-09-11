import type { ReactNode } from 'react'

export type PageId = 'lista' | 'productos' | 'tiendas'

const TABS: { id: PageId; label: string; icon: ReactNode }[] = [
  {
    id: 'lista',
    label: 'Lista',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'productos',
    label: 'Productos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    id: 'tiendas',
    label: 'Tiendas',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 3l9 6.5M4.5 10v9a1 1 0 001 1h13a1 1 0 001-1v-9M9.5 20v-6h5v6" />
      </svg>
    ),
  },
]

interface LayoutProps {
  active: PageId
  onNavigate: (page: PageId) => void
  children: ReactNode
}

export function Layout({ active, onNavigate, children }: LayoutProps) {
  return (
    <div className="min-h-dvh bg-cream flex flex-col">
      <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur border-b border-black/5">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl2 bg-mint-200 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 text-emerald-800">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.4 12.2a2 2 0 002 1.8h8.4a2 2 0 002-1.8L21 8H6" />
              <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
              <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-ink leading-tight truncate">Mi Lista de la Compra</h1>
            <p className="text-xs text-slate leading-tight">Compara precios y compra más barato</p>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-5 pb-28">{children}</main>

      <nav className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-black/5">
        <div className="mx-auto max-w-3xl px-4 flex">
          {TABS.map((tab) => {
            const isActive = active === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                  isActive ? 'text-emerald-800' : 'text-slate hover:text-ink'
                }`}
              >
                <span
                  className={`flex items-center justify-center h-9 w-9 rounded-full transition-colors ${
                    isActive ? 'bg-mint-200' : ''
                  }`}
                >
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
