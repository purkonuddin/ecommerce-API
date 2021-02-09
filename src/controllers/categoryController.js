const categoryModel = require('../models/categoryModel')
const uuid = require('uuid')
const productsModel = require('../models/productModel')

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
    return res.send({
      object: 'category',
      action: 'insert new category',
      msg: 'tidak ada data yang ditambahkan'
    })
  }

  req.body.object = 'category'
  req.body.action = 'insert'
  req.body.msg = null
  req.body.id = results.insertId
  req.body.category_id = categoryId

  next()
}

const DeleteCategory = async (req, res, next) => {
  const categoryId = req.params.category_id
  const [results] = await Promise.all([
    categoryModel.delete(categoryId)
  ])

  //   console.log(results)

  if (results.affectedRows !== 1) {
    return res.send({
      object: 'category',
      action: 'delete ',
      msg: 'tidak ada data yang dihapus'
    })
  }

  req.body.object = 'category'
  req.body.action = 'delete, '
  req.body.msg = `category_id ${categoryId} telah dihapus`

  next()
}

const RemoveImgs = (req, res, next) => {
  const categoryImage = req.body.category_image
  if (categoryImage.length <= 0) {
    return res.send({
      object: 'category',
      action: 'remove images',
      msg: `${req.body.msg}, tapi tidak ditemukan foto untuk category ini.`,
      result: null
    })
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
  req.body.msg = null
  next()
}

const GetCategoryById = async (req, res, next) => {
  const categoryId = req.params.category_id
  const [results] = await Promise.all([
    categoryModel.getById(categoryId)
  ])

  //   console.log(results)

  if (results.length <= 0) {
    return res.send({
      object: 'category',
      action: 'get by category_id',
      msg: 'tidak ada data dengan category_id = ' + categoryId
    })
  }

  req.body.object = 'category'
  req.body.action = 'get by category_id'
  req.body.msg = null
  req.body.category_id = categoryId
  req.body.category_name = results[0].category_name
  req.body.category_image = results[0].category_image.split(', ')
  next()
}

const GetAllCategory = async (req, res, next) => {
  const [results] = await Promise.all([
    categoryModel.getAll()
  ])

  //   console.log(results)

  if (results.length <= 0) {
    return res.send({
      object: 'category',
      action: 'get categories',
      msg: 'tidak ada data category'
    })
  }

  req.body.object = 'category'
  req.body.action = 'get categories'
  req.body.msg = null
  req.body.category = results
  next()
}

const CekProductByCategory = async (req, res, next) => {
  const strQueryRows = `SELECT COUNT(*) AS baris FROM tb_products WHERE product_category = '${req.body.category_name}'`
  const [Rows] = await Promise.all([
    productsModel.Rows(strQueryRows)
  ])

  //   console.log(Rows[0].baris)
  if (Rows[0].baris >= 1) {
    return req.send({
      object: 'category',
      action: 'remove categories',
      msg: `category tidak bisa dihapus karna digunakan pada tb_products. Rows(${Rows[0].baris})`
    })
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
