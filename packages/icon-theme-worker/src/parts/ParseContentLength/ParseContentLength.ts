export const parseContentLength = (response: Response): number => {
  const raw = response.headers.get('Content-Length')
  if (raw) {
    return Number(raw)
  }
  return 1
}
