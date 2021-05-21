const express = require('express')
const router = express.Router()
const eventController = require('../controllers/eventController')
const { sendResponse } = require('../helpers/response')
const { eventImage } = require('../helpers/uploadMidleware')

router.route('/')
  .post(eventImage, eventController.insertEvent, sendResponse)
  .get(eventController.getEvent, sendResponse)
module.exports = router
