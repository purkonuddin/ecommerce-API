const eventModel = require('../models/eventModel')
const helpers = require('../helpers')

const InsertEvent = async (req, res, next) => {
  try {
    const data = {
      title: req.body.title,
      location: req.body.location,
      partisipan: req.body.partisipant,
      date: req.body.date,
      description: req.body.description,
      image: req.body.file
    }
    console.log(data)
    const [results] = await Promise.all([
      eventModel.insertEvent(data)
    ])
    if (results.affectedRows !== 1) {
      helpers.customErrorResponse(res, 400, 'gagal menyimpan')
    } else {
      req.body.object = 'event'
      req.body.action = 'post to tb_event'
      req.body.results = results
      req.body.message = 'success'
      next()
    }
  } catch (error) {
    console.log(error)
  }
}

const GetEvent = async (req, res, next) => {
  try {
    const [results] = await Promise.all([
      eventModel.getEvents()
    ])
    req.body.object = 'Event'
    req.body.action = 'get Events\'s data'
    req.mystore = results
    req.body.results = results
    req.body.message = 'fulfilled'
    next()
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getEvent: GetEvent,
  insertEvent: InsertEvent
}
