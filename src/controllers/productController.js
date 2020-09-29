const paginate = require('express-paginate')
const productModule = require('../models/productModel')
const multer = require('multer')
const fs = require('fs')

const uploadImages = (req, res, next) => {
  const prdId = Date.now()
  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'src/assets/images/upload')
      },
      filename: function (req, file, cb) {
        const match = ['image/png', 'image/jpeg']

        if (match.indexOf(file.mimetype) === -1) {
          var message = `${file.originalname} is invalid. Only accept png/jpeg.`
          return cb(message, null)
        }

        cb(null, `${prdId}-${file.originalname}`)
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image')) {
        cb(null, true)
      } else {
        cb(null, false)
      }
    }
  })
  const uploadFiles = upload.array('images', 5)

  uploadFiles(req, res, err => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.send('Too many files to upload.')
      }
    } else if (err) {
      return res.send(err)
    }

    const images = req.files.map(image => ` ${process.env.APP_URL_UPLOADS + image.filename}`).join(',')
    const priceAftDisc = req.body.product_price - (req.body.product_price * req.body.disc)
    /*
    const dataProduct = {
      product_id: prdId,
      product_name: req.body.product_name,
      product_description: req.body.product_description,
      product_image: images,
      product_category: req.body.product_category,
      product_price: req.body.product_price,
      disc: req.body.disc,
      price_aft_disc: priceAftDisc,
      product_stock: req.body.product_stock,
      seller: req.body.seller,
      product_rating: req.body.product_rating,
      product_condition: req.body.product_condition,
      product_size: req.body.product_size,
      product_color: req.body.product_color
    }
    */
    req.body.product_id = prdId
    req.body.product_image = images
    req.body.price_aft_disc = priceAftDisc
    next()
  })
}

const InsertProduct = (req, res, next) => {
  const priceAftDisc = req.body.product_price - (req.body.product_price * req.body.disc)

  const dataProduct = {
    product_id: req.body.file_prefix, // helper/uploadMiddleware req.body.file_prefix (format: Date.now())
    product_name: req.body.product_name,
    product_description: req.body.product_description,
    product_image: req.body.files, // helper/uploadMiddleware req.body.files
    product_category: req.body.product_category,
    product_price: req.body.product_price,
    disc: req.body.disc,
    price_aft_disc: priceAftDisc,
    product_stock: req.body.product_stock,
    seller: req.userData.user_store,
    product_rating: req.body.product_rating,
    product_condition: req.body.product_condition,
    product_size: req.body.product_size,
    product_color: req.body.product_color
  }
  productModule.insert(dataProduct).then((result) => {
    // console.log(result)
    /**
     * fieldCount: 0,
     * affectedRows: 1,
     * insertId: 58,
     * serverStatus: 2,
     * warningCount: 0,
     * message: '',
     * protocol41: true,
     * changedRows: 0
     */
    if (result.affectedRows === 1) {
      req.body.object = 'products'
      req.body.action = 'insert'
      req.body.msg = `data berhasil di tambahkan, insertId: ${result.insertId}`

      req.body.id = result.insertId
      req.body.product_id = dataProduct.product_id
      req.body.product_image = dataProduct.product_image.split(', ')
      req.body.product_size = dataProduct.product_size.split(', ')
      req.body.product_color = dataProduct.product_color.split(', ')
      next()
    }

    return res.send({
      object: 'product',
      action: 'insert',
      msg: 'tidak ada data tersimpan',
      result: null
    })
  }).catch(err => new Error(err))
}

const delProduct = (req, res, next) => {
  // get data by id
  const productId = req.params.id
  const userStore = req.userData.user_store
  // res.send({ productId, userStore })
  productModule.delete(productId, userStore).then((result) => {
    /**
     * fieldCount: 0,
     * affectedRows: 0,
     * insertId: 0,
     * serverStatus: 34,
     * warningCount: 0,
     * message: '',
     * protocol41: true,
     * changedRows: 0
     */

    if (result.affectedRows === 0) {
      return res.send({
        object: 'product',
        action: 'delete',
        msg: `tidak ditemukan produk dari seller ${userStore} dengan productId ${productId}`,
        result: null
      })
    }

    /**
     * fieldCount: 0,
     * affectedRows: 1,
     * insertId: 0,
     * serverStatus: 34,
     * warningCount: 0,
     * message: '',
     * protocol41: true,
     * changedRows: 0
     */
    // console.log(result)
    req.body.object = 'products'
    req.body.action = 'delete'
    req.body.msg = `product dengan Id ${productId} telah dihapus.`

    next()
  }).catch(err => new Error(err))
}

const removeImgs = async (req, res, next) => {
  const msg = req.body.msg
  const images = await req.body.images
  if (images.length <= 0) {
    return res.send({
      object: 'product',
      action: 'remove images',
      msg: `${msg}, tapi tidak ditemukan foto untuk product ini.`,
      result: null
    })
  }
  // remove image
  await images.map(async file => {
    const fileImage = await file.substr(file.indexOf('imgs-products/') + 14)
    await fs.unlink(`src/assets/images/products/${fileImage}`, function (err) {
      if (err) {
        /**
         * [Error: ENOENT: no such file or directory, unlink 'D:\upgrading1\resthub\src\assets\images\upload\host:8080\imgs\1601064041495-icecreambanansplit.png'] {
         * errno: -4058,
         * code: 'ENOENT',
         * syscall: 'unlink',
         * path: 'D:\\upgrading1\\resthub\\src\\assets\\images\\upload\\host:8080\\imgs\\1601064041495-icecreambanansplit.png'
         * }
         */
        return res.send({ err: err })
      }
    })
  })

  next()
}

const editProduct = (req, res, next) => {
  const epriceAftDisc = req.body.product_price - (req.body.product_price * req.body.disc)
  const editdata = {
    product_name: req.body.product_name,
    product_description: req.body.product_description,
    product_category: req.body.product_category,
    product_price: req.body.product_price,
    disc: req.body.disc,
    price_aft_disc: epriceAftDisc,
    product_stock: req.body.product_stock,
    // seller: req.body.seller,
    // product_rating: req.body.product_rating,
    product_condition: req.body.product_condition,
    product_size: req.body.product_size,
    product_color: req.body.product_color
  }
  // console.log(editdata)
  productModule.update(editdata, req.params.id, req.userData.user_store).then((result) => {
    if (result.changedRows === 0) {
      return res.send({
        object: 'product',
        action: 'update by product_id',
        msg: `Tidak ada data yang di update, product dengan id ${req.params.id}!`,
        result: null
      })
    }

    req.body.object = 'products'
    req.body.action = 'update by product_id'
    req.body.msg = `selesai di update, product id ${req.params.id}!`
    next()
  }).catch(err => new Error(err))
}

const getProdById = async (req, res, next) => {
  const productId = req.body.product_id || req.params.id
  console.log(productId)
  const [result] = await Promise.all([
    productModule.getbyid(productId)
  ])

  if (result.length === 0) {
    return res.send({
      object: 'product',
      action: 'select by product_id',
      msg: `tidak ditemukan product dengan id ${productId}`,
      result: null
    })
  }

  req.body.object = 'products'
  req.body.action = 'select by product_id'
  req.body.msg = null
  req.body.id = result[0].id
  req.body.product_id = result[0].product_id
  req.body.product_name = result[0].product_name
  req.body.product_description = result[0].product_description
  req.body.images = await result[0].product_image.split(', ')
  req.body.product_category = result[0].product_category
  req.body.product_price = result[0].product_price
  req.body.disc = result[0].disc
  req.body.price_aft_disc = result[0].price_aft_disc
  req.body.product_stock = result[0].product_stock
  req.body.seller = result[0].seller
  req.body.product_rating = result[0].product_rating
  req.body.product_condition = result[0].product_condition
  req.body.product_size = await result[0].product_size.split(', ')
  req.body.product_color = await result[0].product_color.split(', ')
  req.body.added_at = result[0].added_at
  req.body.updated_at = result[0].updated_at

  next()
}

const Sort = async (req, res, next) => {
  // const rawUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
  // const parsedUrl = url.parse(rawUrl)
  // const parsedQs = querystring.parse(parsedUrl.query)

  const a = []
  a.push(req.query)
  var data = []
  var dataset = []
  var param = []
  var paramset = []
  /**
   * strQuery for paging `LIMIT ${page + ', ' + perpage}`
   */
  const page = req.query.page > 1 ? (req.query.page * req.query.limit) - req.query.limit : 0
  const perpage = req.query.limit || '10'
  /**
   * strQuery for sort `ORDER BY ${orderBy} ${ascDesc}`
   * default `ORDER BY product_price ASC`
   */
  const orderBy = req.query.order_by || 'product_price'
  const ascDesc = req.query.sort || 'ASC'

  a.forEach((val, index) => {
    if (a[index] !== null) {
      for (var i in a[index]) {
        if (i !== 'order_by' && i !== 'sort' && i !== 'page' && i !== 'limit') {
          param.push(i)
          data.push(a[index][i])
        }
      }
      dataset.push(data)
      paramset.push(param)
    }
  })

  // console.log(paramset[0])
  let qrys = ''

  for (let a = 0; a < paramset[0].length; a++) {
    if (paramset[0][a] === 'product_name') {
      qrys += ` ${paramset[0][a]} LIKE '%${dataset[0][a]}%'`
    } else {
      qrys += ` ${paramset[0][a]}='${dataset[0][a]}'`
    }
    const and = paramset[0].length > a + 1 ? 'AND' : ''
    qrys += ` ${and}`
  }

  const whereParams = paramset[0].length > 0 ? ` WHERE${qrys}` : ''
  const paging = `LIMIT ${page + ', ' + perpage}`
  const sorting = `ORDER BY ${orderBy} ${ascDesc}`

  const strQry = `SELECT * FROM tb_products${whereParams} ${sorting} ${paging}`
  const strQryRows = `SELECT COUNT(*) AS baris FROM tb_products${whereParams}`
  // console.log(strQry)
  const [results, rows] = await Promise.all([
    productModule.sort(strQry),
    productModule.Rows(strQryRows)
  ])

  const totalrows = rows[0].baris
  const pageCount = Math.ceil(totalrows / req.query.limit)

  req.body.object = 'products'
  req.body.has_more = paginate.hasNextPages(req)(pageCount)
  req.body.total_page = pageCount
  req.body.total = totalrows
  req.body.curren_page = parseInt(req.query.page)
  req.body.offset = page
  req.body.hasPreviousPages = res.locals.hasPreviousPages
  req.body.hasNextPages = paginate.hasNextPages(req)(pageCount)
  req.body.next_page = req.query.page <= pageCount - 1 ? parseInt(req.query.page) + 1 : undefined
  req.body.prev_page = req.query.page > 1 ? req.query.page - 1 : undefined
  req.body.pages = paginate.getArrayPages(req)(pageCount, pageCount, req.query.page)
  req.body.data = results
  next()
}

const ReduceStock = async (req, res, next) => {
  console.log(req.body)
  const cartQty = req.body.qty
  const productId = req.body.product_id
  const [updateStock] = await Promise.all([
    productModule.reduceStock(cartQty, productId)
  ])

  if (updateStock.changedRows === 0) {
    return res.send({
      object: 'product',
      action: 'update stock',
      msg: `Tidak ada data yang di update, product dengan id ${req.body.product_id}!`,
      result: null
    })
  }

  req.body.msg = `product Id ${req.body.product_id} telah di reduce`

  next()
}

module.exports = {
  uploadMidleware: uploadImages,
  insertNewProduct: InsertProduct,
  deleteProduct: delProduct,
  removeImg: removeImgs,
  patch: editProduct,
  getById: getProdById,
  sortProducts: Sort,
  reduceStock: ReduceStock
}
