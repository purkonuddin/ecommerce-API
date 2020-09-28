const express = require('express')
const slide = express.Router()
const { isLoggedIn } = require('../helpers/users')
const { uploadMidleware } = require('../helpers/uploadMidleware')
const { sendResponse } = require('../helpers/response')
const { slideFormMidleware } = require('../helpers/slide')
const { insertSlide } = require('../controllers/slideController')

slide.route('/').post(isLoggedIn, uploadMidleware, slideFormMidleware, insertSlide, sendResponse)
module.exports = slide
