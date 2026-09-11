interface ProductThumbProps {
  photo?: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES: Record<NonNullable<ProductThumbProps['size']>, string> = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-32 w-full',
}

export function ProductThumb({ photo, alt, size = 'md' }: ProductThumbProps) {
  const sizeClass = SIZE_CLASSES[size]

  if (photo) {
    return (
      <img
        src={photo}
        alt={alt}
        className={`${sizeClass} shrink-0 rounded-xl object-cover bg-cream`}
      />
    )
  }

  return (
    <div
      className={`${sizeClass} shrink-0 rounded-xl bg-cream flex items-center justify-center text-slate/50`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-1/2 w-1/2">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7a2 2 0 012-2h1.5l1-1.5h9l1 1.5H20a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        />
        <circle cx="12" cy="13" r="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
