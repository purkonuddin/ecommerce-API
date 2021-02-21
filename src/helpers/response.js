const helpers = require('./index')

module.exports = {
  sendResponse: (req, res, next) => {
    const data = req.body
    helpers.response(res, 200, data)
  }
}
