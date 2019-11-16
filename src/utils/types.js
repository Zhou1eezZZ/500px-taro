const getTypeTag = obj => Object.prototype.toString.call(obj)

export const isObject = obj => {
    return getTypeTag(obj) === '[object Object]'
}

export const isArray = obj => {
    return getTypeTag(obj) === '[object Array]'
}
