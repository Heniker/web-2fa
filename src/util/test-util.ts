export const maybeTimeout = (message = 'Test timeout', time = 5000) => {
  const timeout = setTimeout(() => {
    throw new Error(message)
  }, time)

  return () => {
    clearTimeout(timeout)
  }
}