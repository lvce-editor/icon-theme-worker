const padBytes = (bytes: number): string => {
  return bytes.toString(16).padStart(2, '0')
}

export const hash = async (content: string): Promise<string> => {
  const sourceBytes = new TextEncoder().encode(content)
  const digest = await crypto.subtle.digest('SHA-256', sourceBytes)
  const resultBytes = [...new Uint8Array(digest)]
  return resultBytes.map(padBytes).join('')
}
