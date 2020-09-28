module.exports = {
  productMidleware: (req, res, next) => {
    if (req.body.product_name === '') {
      return res.status(400).send({
        msg: 'product tidak boleh kosong'
      })
    }

    next()
  }
}
