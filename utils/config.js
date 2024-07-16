const { JWT_SECRET = "secret-pass-phrase"} = process.env;

const crypto = require('crypto')

const randomString = crypto
.randomBytes(16)
.toString('hex')

console.log(randomString)

module.exports = {JWT_SECRET};