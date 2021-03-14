/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const helpers = require('../helpers')
const midtransClient = require('midtrans-client')
// const { v4: uuidv4 } = require('uuid')
const { isLoggedIn } = require('../helpers/users')

router.route('/').post(isLoggedIn, function (req, res) {
  try {
    const newPayment = req.body.gross_amount
    const transaction = req.body.order_id

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: 'SB-Mid-server-mRQpxcyYVgLj724iuQK1JZ9E',
      clientKey: 'SB-Mid-client-f6iSgP7rL6FhREfT'
    })

    const parameter = {
      transaction_details: {
        order_id: transaction,
        gross_amount: newPayment
      },
      credit_card: {
        secure: true
      }
    }

    snap.createTransaction(parameter).then((transaction) => {
      const redirectUrl = transaction.redirect_url
      //   console.log('redirectUrl:', redirectUrl)
      helpers.response(res, 200, redirectUrl)
    }).catch((error) =>
      helpers.customErrorResponse(res, 400, error)
    )
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
