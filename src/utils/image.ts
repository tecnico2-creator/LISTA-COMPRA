/**
 * Redimensiona y comprime una foto (File) a un data URL en base64, para poder guardarla
 * directamente en el documento del producto en Firestore (que tiene un límite de 1 MB por
 * documento). Se prueba con varias combinaciones de tamaño/calidad, de más a menos pesada,
 * hasta que el resultado sea razonablemente pequeño.
 */

const ATTEMPTS: Array<{ maxDim: number; quality: number }> = [
  { maxDim: 640, quality: 0.72 },
  { maxDim: 480, quality: 0.6 },
  { maxDim: 360, quality: 0.5 },
]

const MAX_DATA_URL_LENGTH = 700_000 // ~700 KB en base64, deja margen bajo el límite de 1 MB de Firestore

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se ha podido leer la imagen'))
    }
    img.src = url
  })
}

function drawToDataUrl(img: HTMLImageElement, maxDim: number, quality: number): string {
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
  const width = Math.max(1, Math.round(img.width * scale))
  const height = Math.max(1, Math.round(img.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se ha podido procesar la imagen')
  ctx.drawImage(img, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', quality)
}

export async function fileToCompressedDataUrl(file: File): Promise<string> {
  const img = await loadImage(file)

  let result = ''
  for (const { maxDim, quality } of ATTEMPTS) {
    result = drawToDataUrl(img, maxDim, quality)
    if (result.length <= MAX_DATA_URL_LENGTH) break
  }
  return result
}
