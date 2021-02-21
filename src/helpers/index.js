const crypto = require('crypto')

module.exports = {
  generateSalt: (length) => {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length)
  },
  encryptText: (cipherAlg, key, iv, text, encoding) => {
    var cipher = crypto.createCipheriv(cipherAlg, key, iv)
    encoding = encoding || 'binary'
    var result = cipher.update(text, 'utf8', encoding)
    result += cipher.final(encoding)
    return {
      salt: key,
      passwordHash: result
    }
    /*
    var encText = encryptText('aes256', key, iv, "testtest1", "base64");
    console.log("encrypted text = " + encText);

    */
  },
  decryptText: (cipherAlg, key, iv, text, encoding) => {
    var decipher = crypto.createDecipheriv(cipherAlg, key, iv)
    encoding = encoding || 'binary'
    var result = decipher.update(text, encoding)
    result += decipher.final()
    return {
      salt: key,
      passwordHash: result
    }

    /*
    var decText = decryptText('aes256', key, iv, encText, "base64");
    console.log("decrypted text = " + decText);
    */
  },
  setPassword: (password, salt) => {
    const hash = crypto.createHmac('sha512', salt)
    hash.update(password)
    const value = hash.digest('hex')
    return {
      salt: salt,
      passwordHash: value
    }
  },
  customResponse: (response, status, result, pagination) => {
    var page = []
    var data = {}

    for (var i = 1; i <= pagination.totalPages; i++) {
      page[i - 1] = i
    }

    data.status = status || 200
    data.result = result
    data.totalPages = page

    return response.status(data.status).json(data)
  },

  response: (response, status, data) => {
    const result = {}
    result.status = status || 200
    result.result = data
    return response.status(result.status).json(result)
  },

  customErrorResponse: (response, status, message) => {
    try {
      const result = {}
      result.status = status || 400
      result.message = message
      return response.status(result.status).json(result)
    } catch (error) {
      console.log(error)
    }
  }
}
