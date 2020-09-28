module.exports = {
  slideFormMidleware: (req, res, next) => {
    if (req.body.slide_name === '') {
      return res.status(400).send({
        msg: 'slide_name tidak boleh kosong'
      })
    }

    if (req.body.slide_image === '') {
      return res.status(400).send({
        msg: 'slide_image tidak boleh kosong'
      })
    }

    if (req.body.url === '') {
      return res.status(400).send({
        msg: 'url tidak boleh kosong'
      })
    }

    next()
  }
}
