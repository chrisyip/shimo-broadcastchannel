export function uuid (): string {
  const s: string[] = []
  const crypto = window.crypto ?? (window as any).msCrypto
  const bytes = crypto.getRandomValues(new Uint8Array(20))
  for (let index = 0; index < bytes.length; index++) {
    s.push(bytes[index].toString(16).padStart(2, '0'))
  }

  for (const idx of [4, 7, 10, 13]) {
    s[idx] = '-'
  }

  return s.join('')
}
