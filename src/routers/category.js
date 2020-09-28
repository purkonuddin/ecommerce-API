const express = require('express')
const category = express.Router()
const { isLoggedIn } = require('../helpers/users')
const { sendResponse } = require('../helpers/response')
const { uploadMidleware } = require('../helpers/uploadMidleware')
const { validasiForm } = require('../helpers/categoryMidleware')
const { cekProductByCategory, getAllCategory, insertCategory, getCategoryById, deleteCategory, removeImgs } = require('../controllers/categoryController')

category.route('/')
  .get(getAllCategory, sendResponse)
  .post(isLoggedIn, uploadMidleware, validasiForm, insertCategory, sendResponse)
category.route('/:category_id').delete(isLoggedIn, getCategoryById, cekProductByCategory, deleteCategory, removeImgs, sendResponse)
module.exports = category
