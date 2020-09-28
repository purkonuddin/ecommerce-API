const express = require('express')
const order = express.Router()
const { createIdOrder, inserToOrderTable, getCartWithStsOrderAndInsertToListOrder } = require('../controllers/orderController')
const { addToCart, changeStsItemAtChart } = require('../controllers/cartController')
const { reduceStock } = require('../controllers/productController')
const { isLoggedIn } = require('../helpers/users')
const { sendResponse } = require('../helpers/response')

/**
 * alur untuk melakukan order:
 * addToCart : user menambah data ke cart
 * changeStsItemAtChart : ubah status item di cart jadi 'order'
 * create-order: sistem membuat nomor_order, simpan data inputan user (total, alamat, payment, dll) ke tb_order, ambil dan simpan data tb_cart yang memiliki status 'order' ke tb_detail_order lalu hapus datanya, tampilkan semua data order
 */
order.route('/create-order').post(isLoggedIn, createIdOrder, inserToOrderTable, getCartWithStsOrderAndInsertToListOrder, sendResponse) // order revisi
// order.route('/').post(isLoggedIn, cekStock, insertOrder, create) // order sebelumnya
order.route('/addToCart').post(isLoggedIn, addToCart, sendResponse)
order.route('/changeStsItemAtChart').patch(isLoggedIn, changeStsItemAtChart, reduceStock, sendResponse)

module.exports = order
