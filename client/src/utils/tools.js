// 节流
export const debounce = (fn, ms = 500) => {
  let timeoutId
  return function () {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn.apply(this, arguments)
    }, ms)
  }
}