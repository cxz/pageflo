
// const _ = require('lodash')
// const substruct = require('@internalfx/substruct')
const bcrypt = require(`bcryptjs`)
const Promise = require(`bluebird`)

module.exports = async function (config) {
  const targetRounds = 10
  const hashPassword = async function (password) {
    console.time(`hashPassword`)
    const salt = await Promise.fromCallback(function (cb) { bcrypt.genSalt(targetRounds, cb) })
    const hash = await Promise.fromCallback(function (cb) { bcrypt.hash(password, salt, cb) })
    console.timeEnd(`hashPassword`)
    return hash
  }

  const checkPassword = async function (password, hash) {
    console.time(`checkPassword`)
    let newHash = null
    const result = await bcrypt.compare(password, hash)

    if (result === true && bcrypt.getRounds(hash) !== targetRounds) {
      newHash = await hashPassword(password)
    }

    console.timeEnd(`checkPassword`)
    return {
      result,
      newHash
    }
  }

  return {
    hashPassword,
    checkPassword
  }
}
