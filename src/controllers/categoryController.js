const categoryModel = require('../models/categoryModel')
const uuid = require('uuid')
const productsModel = require('../models/productModel')
const helpers = require('../helpers')

const InsertNewCategory = async (req, res, next) => {
  const categoryId = uuid.v4()
  const dataCtgry = {
    category_id: categoryId,
    category_name: req.body.category_name,
    category_image: req.body.files
  }

  const [results] = await Promise.all([
    categoryModel.insert(dataCtgry)
  ])

  if (results.affectedRows !== 1) {
    helpers.customErrorResponse(res, 400, 'tidak ada data yang ditambahkan')
  }

  req.body.object = 'category'
  req.body.action = 'insert'
  req.body.message = 'post new categori fulfilled'
  req.body.id = results.insertId
  req.body.category_id = categoryId
  req.body.data = results

  next()
}

const DeleteCategory = async (req, res, next) => {
  const categoryId = req.params.category_id
  const [results] = await Promise.all([
    categoryModel.delete(categoryId)
  ])

  //   console.log(results)

  if (results.affectedRows !== 1) {
    helpers.customErrorResponse(res, 400, 'tidak ada data yang dihapus')
  }

  req.body.object = 'category'
  req.body.action = 'delete, '
  req.body.message = `delete category_id ${categoryId} fulfilled`
  req.body.data = results

  next()
}

const RemoveImgs = (req, res, next) => {
  const categoryImage = req.body.category_image
  if (categoryImage.length <= 0) {
    helpers.customErrorResponse(res, 400, `${req.body.msg}, tapi tidak ditemukan foto untuk category ini.`)

    // return res.send({
    //   object: 'category',
    //   action: 'remove images',
    //   msg: `${req.body.msg}, tapi tidak ditemukan foto untuk category ini.`,
    //   result: null
    // })
  }
  // remove image
  var fs = require('fs')

  categoryImage.map(file => {
    const fileImage = file.substr(file.indexOf('imgs-category') + 14)
    fs.unlink(`src/assets/images/category/${fileImage}`, function (err) {
      if (err) console.log(err)
    })
  })
  req.body.object = 'category'
  req.body.action += 'and remove images, '
  req.body.message = 'remove categori images fulfilled'
  req.body.data = null
  next()
}

const GetCategoryById = async (req, res, next) => {
  const categoryId = req.params.category_id
  const [results] = await Promise.all([
    categoryModel.getById(categoryId)
  ])

  //   console.log(results)

  if (results.length <= 0) {
    helpers.customErrorResponse(res, 400, 'tidak ada data dengan category_id = ' + categoryId)

    // return res.send({
    //   object: 'category',
    //   action: 'get by category_id',
    //   msg: 'tidak ada data dengan category_id = ' + categoryId
    // })
  }

  req.body.object = 'category'
  req.body.action = 'get by category_id'
  req.body.message = 'get category by category_id fulfilled'
  req.body.category_id = categoryId
  req.body.data = results[0]
  next()
}

const GetAllCategory = async (req, res, next) => {
  const [results] = await Promise.all([
    categoryModel.getAll()
  ])

  //   console.log(results)

  if (results.length <= 0) {
    helpers.customErrorResponse(res, 400, 'tidak ada data category')

    // return res.send({
    //   object: 'category',
    //   action: 'get categories',
    //   message: 'tidak ada data category'
    // })
  }

  req.body.object = 'category'
  req.body.action = 'get categories'
  req.body.message = 'get categories fulfilled'
  req.body.data = results
  next()
}

const CekProductByCategory = async (req, res, next) => {
  const strQueryRows = `SELECT COUNT(*) AS baris FROM tb_products WHERE product_category = '${req.body.category_name}'`
  const [Rows] = await Promise.all([
    productsModel.Rows(strQueryRows)
  ])

  //   console.log(Rows[0].baris)
  if (Rows[0].baris >= 1) {
    helpers.customErrorResponse(res, 400, `category tidak bisa dihapus karna digunakan pada tb_products. Rows(${Rows[0].baris})`)

    // return req.send({
    //   object: 'category',
    //   action: 'remove categories',
    //   msg: `category tidak bisa dihapus karna digunakan pada tb_products. Rows(${Rows[0].baris})`
    // })
  }

  next()
}

module.exports = {
  getAllCategory: GetAllCategory,
  insertCategory: InsertNewCategory,
  getCategoryById: GetCategoryById,
  deleteCategory: DeleteCategory,
  removeImgs: RemoveImgs,
  cekProductByCategory: CekProductByCategory
}
