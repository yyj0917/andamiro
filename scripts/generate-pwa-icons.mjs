import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const source = 'public/icon.svg'
const outputs = [
  ['public/favicon-32x32.png', 32],
  ['public/apple-touch-icon.png', 180],
  ['public/pwa-192x192.png', 192],
  ['public/pwa-512x512.png', 512],
  ['public/maskable-512x512.png', 512],
]

await mkdir('public', { recursive: true })

await Promise.all(
  outputs.map(([file, size]) =>
    sharp(source)
      .resize(size, size)
      .png()
      .toFile(file),
  ),
)
