export const getExtensionBaseUrl = (webExtension: any, locationProtocol: string): string => {
  // TODO support file scheme and application scheme
  if (webExtension.uri && webExtension.uri.startsWith('file://') && (locationProtocol === 'http:' || locationProtocol === 'https:')) {
    const relative = webExtension.uri.slice('file://'.length)
    return `/remote${relative}`
  }
  return webExtension.path
}
