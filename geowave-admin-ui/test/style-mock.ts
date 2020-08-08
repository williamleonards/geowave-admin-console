module.exports.default = new Proxy({}, {
    get: (_, key) => key,
})
