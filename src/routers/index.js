const express = require('express')
const router = express.Router()

const user = require('./user')
const products = require('./products')
const order = require('./order')
const category = require('./category')
const slide = require('./slide')
const ongkir = require('./ongkir')
const payment = require('./payment')
const event = require('./event')

router.get('/', function (req, res) {
  res.json({
    status: 'API its works',
    message: 'Welcome to Ecommerce API!'
  })
})
router.use('/user', user)
router.use('/products', products)
router.use('/order', order)
router.use('/category', category)
router.use('/slide', slide)
router.use('/ongkir', ongkir)
router.use('/payment', payment)
router.use('/event', event)
module.exports = router
