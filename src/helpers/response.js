module.exports = {
  sendResponse: (req, res, next) => {
    // const object = req.body.object
    // const action = req.body.action
    // const msg = req.body.msg
    res.json({
      // object: object,
      // action: action,
      // msg: msg,
      result: req.body
    })

    next()
  }
}
