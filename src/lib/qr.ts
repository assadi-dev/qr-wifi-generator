import QRCode from "qrcode"

// Quiet zone around the code, in modules (4 is the QR spec minimum).
const QUIET_ZONE = 4
const EXPORT_MIN_SIZE = 1024

export type QrMatrix = {
  size: number
  isDark: (row: number, col: number) => boolean
}

export function createQrMatrix(text: string): QrMatrix {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: "M" })
  return {
    size: modules.size,
    isDark: (row, col) => modules.get(row, col) === 1,
  }
}

/** SVG viewBox side and path for the matrix, quiet zone included. */
export function qrToSvgPath(matrix: QrMatrix) {
  const side = matrix.size + QUIET_ZONE * 2
  let path = ""

  for (let row = 0; row < matrix.size; row++) {
    let col = 0
    while (col < matrix.size) {
      if (!matrix.isDark(row, col)) {
        col++
        continue
      }
      const start = col
      while (col < matrix.size && matrix.isDark(row, col)) col++
      path += `M${start + QUIET_ZONE} ${row + QUIET_ZONE}h${col - start}v1h-${col - start}z`
    }
  }

  return { side, path }
}

export async function downloadQrPng(matrix: QrMatrix, filename: string) {
  const side = matrix.size + QUIET_ZONE * 2
  // Integer pixels per module keeps every edge sharp.
  const scale = Math.ceil(EXPORT_MIN_SIZE / side)

  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = side * scale
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas 2D indisponible")

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "#000000"
  for (let row = 0; row < matrix.size; row++) {
    for (let col = 0; col < matrix.size; col++) {
      if (matrix.isDark(row, col)) {
        ctx.fillRect(
          (col + QUIET_ZONE) * scale,
          (row + QUIET_ZONE) * scale,
          scale,
          scale
        )
      }
    }
  }

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png")
  )
  if (!blob) throw new Error("Export PNG impossible")

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
