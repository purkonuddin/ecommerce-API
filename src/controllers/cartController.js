const cartModel = require('../models/cartModel')
const helpers = require('../helpers')

const addToCart = (req, res, next) => {
  const dataCart = {
    member_id: req.userData.user_id,
    product_id: req.body.product_id,
    product_name: req.body.product_name,
    category: req.body.product_category,
    seller: req.body.seller,
    product_condition: req.body.cart_product_condition,
    product_size: req.body.cart_product_size,
    product_color: req.body.cart_product_color,
    qty: req.body.cart_qty,
    price: req.body.product_price,
    disc: req.body.disc,
    price_aft_disc: req.body.price_aft_disc,
    subtotal: req.body.price_aft_disc * req.body.cart_qty,
    sts_items: 'pending',
    product_image: req.body.product_image
  }
  //   console.log(req.userData)
  cartModel.insert(dataCart).then((result) => {
    if (result.affectedRows !== 1) {
      // return res.send({
      //   object: 'cart',
      //   action: 'insert',
      //   msg: 'tidak ada data yang ditambahkan'
      // })
      helpers.customErrorResponse(res, 400, 'insert rejected')
    }

    dataCart.id = result.insertId

    req.body.object = 'cart'
    req.body.action = 'insert'
    req.body.message = 'insert fulfilled'
    req.body.item = dataCart

    next()
  }).catch(err => new Error(err))
}

const ChangeStsItemAtChart = async (req, res, next) => {
  const qty = req.body.qty
  const data = {
    member_id: req.userData.user_id,
    product_id: req.body.product_id,
    sts_items: req.body.sts_items
  }

  const [updateStsItems] = await Promise.all([
    cartModel.updateStsItems(data)
  ])

  // console.log(updateStsItems)

  if (updateStsItems.changedRows !== 1 && updateStsItems.affectedRows !== 1) {
    // return res.send({
    //   object: 'cart',
    //   action: 'update sts_item',
    //   message: 'tidak ada data yang ditambahkan'
    // })
    helpers.customErrorResponse(res, 400, 'update sts_item rejected')
  }

  req.body.object = 'cart'
  req.body.action = 'update sts_item'
  req.body.message = 'update sts_item fulfilled'
  req.body.qty = qty
  next()
}

const GetCartByUserId = async (req, res, next) => {
  try {
    const data = {
      member_id: req.userData.user_id,
      sts_items: 'pending'
    }
    const [results] = await Promise.all([
      cartModel.getItemWithStsOrder(data)
    ])
    req.body.object = 'cart'
    req.body.action = 'get user\'s carts'
    req.body.message = 'fulfilled'
    req.body.result = results
    next()
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  addToCart: addToCart,
  changeStsItemAtChart: ChangeStsItemAtChart,
  getUserCarts: GetCartByUserId
}
