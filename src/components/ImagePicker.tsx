import { useRef, useState } from 'react'
import { fileToCompressedDataUrl } from '../utils/image'

interface ImagePickerProps {
  value: string
  onChange: (dataUrl: string) => void
}

export function ImagePicker({ value, onChange }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setError(null)
    setProcessing(true)
    try {
      const dataUrl = await fileToCompressedDataUrl(file)
      onChange(dataUrl)
    } catch (err) {
      console.error(err)
      setError('No se ha podido procesar la foto. Prueba con otra.')
    } finally {
      setProcessing(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <span className="label">Foto (opcional)</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="flex items-center gap-3">
          <img src={value} alt="Foto del producto" className="h-20 w-20 rounded-xl object-cover" />
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="btn-secondary !px-3 !py-1.5 text-xs"
              onClick={() => inputRef.current?.click()}
              disabled={processing}
            >
              Cambiar foto
            </button>
            <button
              type="button"
              className="btn-ghost !px-3 !py-1.5 text-xs"
              onClick={() => onChange('')}
              disabled={processing}
            >
              Quitar foto
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={processing}
          className="w-full flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-black/10 py-5 text-slate hover:bg-cream transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7a2 2 0 012-2h1.5l1-1.5h9l1 1.5H20a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            />
            <circle cx="12" cy="13" r="3.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xs font-medium">
            {processing ? 'Procesando foto…' : 'Hacer o elegir una foto'}
          </span>
        </button>
      )}

      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  )
}
