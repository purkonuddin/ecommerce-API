const express = require('express')
const router = express.Router()
const multer = require('multer')

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//       cb(null, 'src/assets/');
//   },
 
//   filename: function(req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });
 
// let upload = multer({ storage: storage })

const { isLoggedIn, isSeller } = require('../helpers/users')
const { insertNewProduct, sortProducts, getById, removeImg, patch, deleteProduct } = require('../controllers/productController')
const { productMidleware } = require('../helpers/productsMidleware')
const { sendResponse } = require('../helpers/response')
const { uploadMidleware } = require('../helpers/uploadMidleware')

// router.route('/')
//   .post(isLoggedIn, isSeller, (req, res, next) => {
//     upload.array('images',5)
//     console.log('xxxx=>', req);
//     next()
//   }, sendResponse)
//   .get(sortProducts, sendResponse)
router.route('/')
  .post(isLoggedIn, isSeller, uploadMidleware, insertNewProduct, sendResponse)
  .get(sortProducts, sendResponse)
router.route('/:id')
  .get(getById, sendResponse)
  .delete(isLoggedIn, isSeller, getById, deleteProduct, removeImg, sendResponse)
  .patch(isLoggedIn, isSeller, productMidleware, patch, sendResponse)

module.exports = router
