export const supportsNormalCacheKey = (locationProtocol: string): boolean => {
  return locationProtocol === 'http:' || locationProtocol === 'https:'
}
