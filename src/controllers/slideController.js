const uuid = require('uuid')
const slideModel = require('../models/slideModel')

const AddSlide = async (req, res, next) => {
  const slideId = uuid.v4()
  const data = {
    slide_id: slideId,
    slide_name: req.body.slide_name,
    slide_image: req.body.files,
    url: req.body.url
  }

  //   console.log(data)
  const [results] = await Promise.all([
    slideModel.insert(data)
  ])

  //   console.log(results)

  if (results.affectedRows !== 1) {
    return res.send({
      object: 'slide',
      action: 'insert new slide',
      msg: 'tidak ada data yang ditambahkan'
    })
  }

  req.body.object = 'slide'
  req.body.action = 'insert'
  req.body.msg = null
  req.body.id = results.insertId
  req.body.slide_id = slideId

  next()
}

module.exports = {
  insertSlide: AddSlide
}
