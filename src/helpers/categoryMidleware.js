const ValidasiFormCategory = (req, res, next) => {
  // category_name min 6 chars
  if (!req.body.category_name || req.body.category_name.length < 3) {
    return res.status(400).send({
      msg: 'Please enter a category_name with min. 3 chars'
    })
  }

  next()
}

module.exports = {
  validasiForm: ValidasiFormCategory
}
