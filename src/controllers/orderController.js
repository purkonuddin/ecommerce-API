const orderModel = require('../models/orderModel')
const productModel = require('../models/productModel')
const cartModel = require('../models/cartModel')
const helpers = require('../helpers')

const CekStock = (req, res, next) => {
  productModel.getbyid(req.body.product_id).then((result) => {
    if (result.length <= 0) {
      return res.send({ msg: 'product tidak ditemukan' })
    }

    req.body.product_name = result[0].product_name
    req.body.product_category = result[0].product_category
    req.body.product_price = result[0].product_price
    req.body.disc = result[0].disc
    req.body.price_aft_disc = result[0].price_aft_disc
    req.body.seller = result[0].seller
    req.body.product_stock = result[0].product_stock
    // req.body.qty
    // req.body.product_condition
    // req.body.product_size
    // req.body.product_color
    next()
  }).catch(err => new Error(err))
}

const InsertOrder = (req, res, next) => {
  if (req.body.product_stock < 1) {
    // return res.send({ msg: 'Stock tidak tersedia!' })
    helpers.customErrorResponse(res, 400, 'Stock tidak tersedia!')
  }
  const dataToOrderDetail = {
    order_number: req.query.order_number,
    member_id: req.userData.user_id,
    product_id: req.body.product_id,
    product_name: req.body.product_name,
    category: req.body.product_category,
    seller: req.body.seller,
    product_condition: req.body.product_condition,
    product_size: req.body.product_size,
    product_color: req.body.product_color,
    qty: req.body.qty,
    price: req.body.product_price,
    disc: req.body.disc,
    price_aft_disc: req.body.price_aft_disc,
    subtotal: req.body.qty * req.body.price_aft_disc
  }
  orderModel.insertToOrderDetail(dataToOrderDetail).then((result) => {
    if (!result) {
      // return res.send({ error: 'kunaon eta error!' })
      helpers.customErrorResponse(res, 400, 'insert to oreder detail rejected')
    }
    req.body.total_price = dataToOrderDetail.subtotal
    next()
  }).catch(err => new Error(err))
}

const Create = async (req, res, next) => {
  // console.log(req.query.order_number)
  orderModel.cekIdOrder(req.query.order_number).then((result) => {
    // req.body.order_date
    // req.body.expire_date
    // req.body.shiping_price
    // req.body.discount
    // req.body.payment_type
    // req.body.shiping_courir
    // req.body.shiping_city
    // req.body.shiping_address
    // req.body.sts_order
    // req.body.sts_payment

    const ppn = 1 // 10%
    const dataOrder = {
      order_number: req.query.order_number,
      order_date: req.body.order_date,
      expire_date: req.body.expire_date,
      customer_id: req.userData.user_id,
      customer_name: req.userData.user_name,
      total_price: req.body.price_aft_disc,
      shiping_price: req.body.shiping_price,
      discount: req.body.discount,
      ppn: `${ppn}%`,
      payment_total: (req.body.price_aft_disc - (req.body.price_aft_disc * req.body.discount)) + (req.body.shiping_price + (req.body.price_aft_disc * (ppn / 100))),
      payment_type: req.body.payment_type,
      shiping_courir: req.body.shiping_courir,
      shiping_city: req.body.shiping_city,
      shiping_address: req.body.shiping_address,
      sts_order: req.body.sts_order,
      sts_payment: req.body.sts_payment
    }

    if (result.length <= 0) {
      // create new order detail
      orderModel.insertOrder(dataOrder).then((resultA) => {
        // console.log('@insertOrder', resultA)
        if (!resultA) {
          // return res.status(501).send({ msg: 'error' })
          helpers.customErrorResponse(res, 501, 'insert to order rejected')
        }
        // res.send({ msg: 'create new order detail', resultA })
        const data = {
          message: 'create new order detail is fulfilled',
          result: resultA
        }
        helpers.response(res, 200, data)
      }).catch(err => new Error(err))
    }
    // // update order detail
    const totalPrice = result[0].price_aft_disc + req.body.price_aft_disc
    const updateTotalPrice = {
      total_price: totalPrice,
      payment_total: (totalPrice - (totalPrice * req.body.discount)) + (req.body.shiping_price + (totalPrice * (ppn / 100)))
    }

    orderModel.updateOrder(updateTotalPrice, req.query.order_number).then((resultB) => {
      // res.send({ msg: 'updated', result: resultB })
      const data = {
        message: 'update order detail is fulfilled',
        result: resultB
      }
      helpers.response(res, 200, data)
    }).then(err => new Error(err))
  }).catch(err => new Error(err))
}

const CreateIdOrder = (req, res, next) => {
  const orderId = `${req.userData.user_id}-${Date.now()}`
  req.body.ORDER_ID = orderId

  next()
}

const InserToOrderTable = async (req, res, next) => {
  const orderId = req.body.ORDER_ID
  const ppn = 0// 10%

  const dataOrder = {
    order_number: orderId,
    order_date: req.body.order_date,
    expire_date: req.body.expire_date,
    customer_id: req.userData.user_id,
    customer_name: req.userData.user_name,
    total_price: req.body.total_price,
    shiping_price: req.body.shiping_price,
    discount: req.body.discount,
    ppn: `${ppn}%`,
    payment_total: (req.body.total_price - (req.body.total_price * req.body.discount)) + (req.body.total_price + req.body.shiping_price),
    payment_type: req.body.payment_type,
    shiping_courir: req.body.shiping_courir,
    shiping_city: req.body.shiping_city,
    shiping_address: req.body.shiping_address,
    sts_order: req.body.sts_order,
    sts_payment: req.body.sts_payment
  }

  const [results] = await Promise.all([
    orderModel.insertOrder(dataOrder)
  ])

  if (results.affectedRows !== 1) {
    // return res.send({
    //   object: 'create order',
    //   action: 'insert',
    //   message: 'insert to order is rejected'
    // })
    const data = {
      object: 'create order',
      action: 'insert',
      message: 'insert to order is rejected'
    }
    helpers.customErrorResponse(res, 400, data)
  }

  req.body.message = `insert data with id order: ${orderId} is fulfilled`

  next()
}

const GetCartWithStsOrderAndInsertToListOrder = async (req, res, next) => {
  const userId = req.userData.user_id
  const orderNumber = req.body.ORDER_ID
  const data = {
    member_id: userId,
    sts_items: 'order'
  }
  const [myCart] = await Promise.all([
    cartModel.getItemWithStsOrder(data)
  ])

  if (myCart.length <= 0) {
    // return res.send({ msg: `tidak ada data di keranjang dengan userId ${userId} dan status item order` })
    const data = {
      message: `tidak ada data di keranjang dengan userId ${userId} dan status item order`
    }
    helpers.customErrorResponse(res, 400, data)
  }

  // simpan data tb_cart dengan status-item 'order' ke tabel order_detail
  await myCart.map(async cart => {
    // console.log(cart)
    /**
     *   id: 2,
     * member_id: '844a3945-314b-4385-932c-e57e30f8abfa',
     * product_id: '1600846319164',
     * category: 't-shirt',
     * seller: 'Toko ABD',
     * qty: 1,
     * price: 45000,
     * disc: 0.5,
     * price_aft_disc: 22500,
     * subtotal: 22500,
     * sts_items: 'order'
     */
    const dataOrderDetail = {
      order_number: orderNumber,
      member_id: req.userData.user_id,
      product_id: cart.product_id,
      product_name: cart.product_name,
      category: cart.category,
      seller: cart.seller,
      product_condition: cart.product_condition,
      product_size: cart.product_size,
      product_color: cart.product_color,
      qty: cart.qty,
      price: cart.price,
      disc: cart.disc,
      price_aft_disc: cart.price_aft_disc,
      subtotal: cart.qty * cart.price_aft_disc
    }

    const [insResult] = await Promise.all([
      orderModel.insertToOrderDetail(dataOrderDetail)
    ])

    if (insResult.affectedRows !== 1) {
      console.log(`${dataOrderDetail.product_id} gagal disimpan`)
    }

    const dataToDelCart = {
      member_id: userId,
      product_id: cart.product_id,
      sts_items: 'order'
    }

    const [delRes] = await Promise.all([
      cartModel.deleteCartWithStsOrder(dataToDelCart)
    ])

    console.log(delRes.affectedRow)
  })

  req.body.order_items = myCart

  next()
}

module.exports = {
  create: Create,
  cekStock: CekStock,
  insertOrder: InsertOrder,
  createIdOrder: CreateIdOrder,
  inserToOrderTable: InserToOrderTable,
  getCartWithStsOrderAndInsertToListOrder: GetCartWithStsOrderAndInsertToListOrder
}
