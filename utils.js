function isObject(variable) {
    return typeof variable === 'object' && !Array.isArray(variable) && variable !== null
}

module.exports = { isObject }