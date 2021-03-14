/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
var http = require('https')
const { init } = require('rajaongkir-node-js')
const request = init('fda4439419134e27787758b092b9bc98', 'starter')
const helpers = require('../helpers')

router.get('/provinsi', function (req, res) {
  try {
    const province = request.get('/province')
    province.then(prov => {
      const js = JSON.parse(prov)
      // console.log(js)
      if (js.rajaongkir.status.code === 200) {
        // res.send(js)
        helpers.response(res, 200, js)
      } else {
        helpers.customErrorResponse(res, js.rajaongkir.status.code, js.rajaongkir.status.description)
      }
    })
  } catch (error) {
    console.log(error)
  }
})

router.get('/kota/:id', function (req, res) {
  try {
    const allCityInProvince = request.get(`/city?&province=${req.params.id}`)
    allCityInProvince.then(city => {
      const citi = JSON.parse(city)
      if (citi.rajaongkir.status.code === 200) {
        helpers.response(res, 200, citi)
        // res.send(citi)
      } else {
        helpers.customErrorResponse(res, citi.rajaongkir.status.code, citi.rajaongkir.status.description)
      }
    })
  } catch (error) {
    console.log(error)
  }
})

router.post('/cost', function (req, res) {
  try {
    const form = req.body
    const data = {
      origin: form.origin,
      destination: form.destination,
      weight: form.weight,
      courier: form.courier // bisa merequest satu atau beberapa kurir sekaligus
    }
    const cost = request.post('cost', data)
    cost.then(cst => {
    //   console.log(cst)
      const respons = JSON.parse(cst)
      if (respons.rajaongkir.status.code === 200) {
        helpers.response(res, 200, respons)
        // res.send(respons)
      } else {
        helpers.customErrorResponse(res, respons.rajaongkir.status.code, respons.rajaongkir.status.description)
      }
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
