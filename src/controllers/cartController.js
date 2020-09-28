const cartModel = require('../models/cartModel')
const addToCart = (req, res, next) => {
  const dataCart = {
    member_id: req.userData.user_id,
    product_id: req.body.product_id,
    product_name: req.body.product_name,
    category: req.body.category,
    seller: req.body.seller,
    product_condition: req.body.product_condition,
    product_size: req.body.product_size,
    product_color: req.body.product_color,
    qty: req.body.qty,
    price: req.body.price,
    disc: req.body.disc,
    price_aft_disc: req.body.price_aft_disc,
    subtotal: req.body.price_aft_disc * req.body.qty,
    sts_items: 'pending'
  }
  //   console.log(req.userData)
  cartModel.insert(dataCart).then((result) => {
    if (result.affectedRows !== 1) {
      return res.send({
        object: 'cart',
        action: 'insert',
        msg: 'tidak ada data yang ditambahkan'
      })
    }

    req.body.object = 'cart'
    req.body.action = 'insert'
    req.body.msg = null
    req.body.id = result.insertId

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
    return res.send({
      object: 'cart',
      action: 'update',
      msg: 'tidak ada data yang ditambahkan'
    })
  }

  req.body.object = 'cart'
  req.body.action = 'update sts_item'
  req.body.msg = null
  req.body.qty = qty
  next()
}

module.exports = {
  addToCart: addToCart,
  changeStsItemAtChart: ChangeStsItemAtChart
}
