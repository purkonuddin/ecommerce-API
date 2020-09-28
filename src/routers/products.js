const express = require('express')
const router = express.Router()
const { isLoggedIn, isSeller } = require('../helpers/users')
const { insertNewProduct, sortProducts, getById, removeImg, patch, deleteProduct } = require('../controllers/productController')
const { productMidleware } = require('../helpers/productsMidleware')
const { sendResponse } = require('../helpers/response')
const { uploadMidleware } = require('../helpers/uploadMidleware')

router.route('/')
  .post(isLoggedIn, isSeller, uploadMidleware, insertNewProduct, sendResponse)
  .get(sortProducts, sendResponse)
router.route('/:id')
  .get(getById, sendResponse)
  .delete(isLoggedIn, isSeller, getById, deleteProduct, removeImg, sendResponse)
  .patch(isLoggedIn, isSeller, productMidleware, patch, sendResponse)

module.exports = router
