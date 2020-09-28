require('dotenv').config()
const db = require('../configs/db')
// const uuid = require('uuid')

const InsertOrderDetail = (data) => {
  return new Promise((resolve, reject) => {
    db.query(`INSERT INTO tb_order_detail(
        order_number, 
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
        subtotal 
        ) VALUES (
            '${data.order_number}',
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
            '${data.subtotal}'
        )`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const InsertOrder = (data) => {
  return new Promise((resolve, reject) => {
    db.query(`INSERT INTO tb_orders(
        order_number, 
        order_date, 
        expire_date, 
        customer_id,
        customer_name, 
        total_price, 
        shiping_price,
        discount,
        ppn,
        payment_total,
        payment_type, 
        shiping_courir, 
        shiping_city, 
        shiping_address, 
        sts_order,
        sts_payment 
            ) VALUES (
                '${data.order_number}',
                '${data.order_date}',
                '${data.expire_date}',
                '${data.customer_id}',
                '${data.customer_name}',
                '${data.total_price}',
                '${data.shiping_price}',
                '${data.discount}',
                '${data.ppn}',
                '${data.payment_total}',
                '${data.payment_type}',
                '${data.shiping_courir}',
                '${data.shiping_city}',
                '${data.shiping_address}',
                '${data.sts_order}',
                '${data.sts_payment}'
            )`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const CekIdOrder = (orderNumber) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM tb_orders WHERE order_number = '${orderNumber}'`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}
const UpdateOrder = (data, orderNumber) => {
  return new Promise((resolve, reject) => {
    db.query(`UPDATE tb_orders SET total_price='${data.total_price}', payment_total='${data.payment_total}' WHERE order_number = '${orderNumber}'`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}
const Delete = (req, res, next) => {}

module.exports = {
  insertToOrderDetail: InsertOrderDetail,
  insertOrder: InsertOrder,
  cekIdOrder: CekIdOrder,
  updateOrder: UpdateOrder,
  delete: Delete
}
