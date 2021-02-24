const uuid = require('uuid')
const slideModel = require('../models/slideModel')
const helpers = require('../helpers')

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
    helpers.customErrorResponse(res, 400, 'tidak ada data yang ditambahkan')
  }

  req.body.object = 'slide'
  req.body.action = 'insert'
  req.body.message = 'insert slide success'
  req.body.data = results
  delete req.body.slide_name
  delete req.body.files
  delete req.body.url

  next()
}

const GetSlides = async (req, res, next) => {
  try {
    const [results] = await Promise.all([
      slideModel.getSlide()
    ])

    // console.log(results)
    req.body.object = 'slide'
    req.body.action = 'get'
    req.body.message = 'get all slide\'s data'
    req.body.data = results
    next()
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  insertSlide: AddSlide,
  getSlides: GetSlides
}
