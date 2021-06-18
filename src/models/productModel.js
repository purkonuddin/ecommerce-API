require('dotenv').config()
const { reject } = require('async')
const db = require('../configs/db')
// const uuid = require('uuid')

module.exports = {
  // new products this week asc
  // SELECT * FROM tb_products WHERE YEARWEEK(`added_at`)=YEARWEEK(NOW()) ORDER BY `added_at` ASC
  // list produk berdasarkan category
  // SELECT * FROM tb_products ORDER BY `product_category` ASC
  // products berdasarkan parameter A(product_category='t-shirt'),B,C,D, order by X diurutkan secara ASC/DESC
  // SELECT * FROM tb_products WHERE product_category='t-shirt' AND seller = 'Toko Shofa' AND product_condition='baru' ORDER BY product_price ASC
  reduceStock: (qty, productId) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE ecommerce.tb_products SET product_stock = (product_stock - ${qty}) WHERE product_id ='${productId}'`, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  sort: (qry) => {
    return new Promise((resolve, reject) => {
      db.query(`${qry}`, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  searchProduct: (name) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM ecommerce.tb_products WHERE product_name LIKE ?', '%' + name + '%', (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  }, 
  Rows: (strQueryRow) => {
    return new Promise((resolve, reject) => {
      db.query(`${strQueryRow}`, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  pagingProduct: (page, perpage) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ecommerce.tb_products LIMIT ${page + ', ' + perpage}`, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  getall: () => {
    return new Promise(function (resolve, reject) {
      db.query('SELECT * FROM ecommerce.tb_products', function (error, result) {
        if (!error) {
          resolve(result)
        } else {
          reject(new Error(error))
        }
      })
    })
  },
  getbyid: (productid) => {
    return new Promise(function (resolve, reject) {
      db.query(`SELECT * FROM ecommerce.tb_products WHERE LOWER(product_id) = LOWER(${db.escape(productid)})`, function (error, result) {
        if (!error) {
          resolve(result)
        } else {
          reject(new Error(error))
        }
      })
    })
  },
  delete: (productId, userStore) => {
    return new Promise(function (resolve, reject) {
      // DELETE FROM `tb_products` WHERE `seller`='toko ABC' AND `product_id`='1600897055714'
      db.query(`DELETE FROM ecommerce.tb_products WHERE product_id = '${productId}' AND seller = '${userStore}'`, function (error, result) {
        if (!error) {
          resolve(result)
        } else {
          reject(new Error(error))
        }
      })
    })
  },
  update: (data, productid, seller) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE ecommerce.tb_products SET ?,updated_at = now() WHERE product_id=? AND seller='${seller}'`, [data, productid], (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  insertProduct: (data) => {
    // console.log('model==>', data);
    return new Promise(function (resolve, reject) {
      db.query(
              `INSERT INTO ecommerce.tb_products ( 
                product_id, 
                product_name, 
                product_description, 
                product_image, 
                product_category, 
                product_price, 
                disc,
                price_aft_disc,
                product_stock, 
                seller, 
                product_rating, 
                product_condition, 
                product_size, 
                product_color, 
                added_at, 
                updated_at) 
              VALUES (
                  '${data.product_id.toString()}', 
                  '${data.product_name}', 
                  '${data.product_description}',
                  '${data.product_image}',
                  '${data.product_category}',
                  '${data.product_price}', 
                  '${data.disc}',
                  '${data.price_aft_disc.toString()}',
                  '${data.product_stock}', 
                  '${data.seller}', 
                  '${data.product_rating}', 
                  '${data.product_condition}', 
                  '${data.product_size}', 
                  '${data.product_color}', 
                  now(),
                  NULL)`,
              function (error, result) {
                if (!error) {
                  resolve(result)
                } else {
                  reject(new Error(error))
                }
              })
    })
  }
}
