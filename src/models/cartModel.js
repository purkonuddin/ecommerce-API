require('dotenv').config()
const db = require('../configs/db')
// const uuid = require('uuid')

const Insert = (data) => {
  return new Promise((resolve, reject) => {
    db.query(`INSERT INTO tb_cart ( 
            member_id, 
            product_id, 
            product_name,
            category, 
            seller, 
            product_condition,
            product_size,
            product_color,
            qty, 
            price, 
            disc, 
            price_aft_disc, 
            subtotal, 
            sts_items
            ) VALUES ( 
                '${data.member_id}',
                '${data.product_id}',
                '${data.product_name}',
                '${data.category}',
                '${data.seller}',
                '${data.product_condition}',
                '${data.product_size}',
                '${data.product_color}',
                '${data.qty}',
                '${data.price}',
                '${data.disc}',
                '${data.price_aft_disc}',
                '${data.subtotal}',
                '${data.sts_items}'
            )`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}
const updateStsItems = (data) => {
  return new Promise(function (resolve, reject) {
    db.query(`UPDATE tb_cart SET sts_items = '${data.sts_items}' WHERE member_id = '${data.member_id}' AND product_id = '${data.product_id}'`, function (error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const GetItemWithStsOrder = (data) => {
  return new Promise(function (resolve, reject) {
    db.query(`SELECT * FROM tb_cart WHERE member_id ='${data.member_id}' AND sts_items = '${data.sts_items}'`, function (error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const DeleteCartWithStsOrder = (data) => {
  return new Promise(function (resolve, reject) {
    db.query(`DELETE FROM tb_cart WHERE product_id = '${data.product_id}' AND member_id ='${data.member_id}' AND sts_items = '${data.sts_items}'`, function (error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}
const Update = (req, res, next) => {}
const Delete = (req, res, next) => {}

module.exports = {
  insert: Insert,
  updateStsItems: updateStsItems,
  update: Update,
  delete: Delete,
  getItemWithStsOrder: GetItemWithStsOrder,
  deleteCartWithStsOrder: DeleteCartWithStsOrder
}
