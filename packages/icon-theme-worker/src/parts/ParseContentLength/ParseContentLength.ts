export const parseContentLength = (response: Response): number => {
  const raw = response.headers.get('Content-Length')
  if (raw) {
    const match = /^\s*([+-]?\d+)/.exec(raw)
    if (match) {
      return Number(match[1])
    }
    return NaN
  }
  return 1
}
