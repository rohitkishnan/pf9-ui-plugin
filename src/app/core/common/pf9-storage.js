const LOCAL_STORAGE_NAMESPACE = 'pf9'

const getInstance = () => {
  const json = window.localStorage.getItem(LOCAL_STORAGE_NAMESPACE) || '{}'
  return JSON.parse(json)
}

export const getStorage = key => getInstance()[key]

export const setStorage = (key, value) => {
  const current = getInstance()
  current[key] = value
  window.localStorage.setItem(LOCAL_STORAGE_NAMESPACE, JSON.stringify(current))
}

export const clear = key => {
  const current = getInstance()
  delete current[key]
  window.localStorage.setItem(LOCAL_STORAGE_NAMESPACE, JSON.stringify(current))
}
