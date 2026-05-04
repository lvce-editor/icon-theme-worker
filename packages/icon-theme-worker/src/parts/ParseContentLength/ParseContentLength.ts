export const parseContentLength = (response: Response): number => {
  const raw = response.headers.get('Content-Length')
  if (raw) {
    return Number.parseInt(raw, 10)
  }
  return 1
}
