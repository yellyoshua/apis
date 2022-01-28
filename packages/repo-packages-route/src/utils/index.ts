export const parseUrl = (url: string) => {
  const fullPath = url.split('/').slice(3).join('/')
  const isLastWordSlash = fullPath.slice(fullPath.length - 1) === '/'
  const cleanPath = fullPath.slice(
    0,
    isLastWordSlash ? fullPath.length - 1 : undefined,
  )
  return `/${cleanPath}`
}
