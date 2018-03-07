export const pluck = key => obj => obj[key]
export const identity = x => x

export const pluckAsync = key => promise => promise.then(obj => obj[key])
