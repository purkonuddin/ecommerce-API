const db = require('../configs/db')

const InsertAddress = (data) => {
  return new Promise((resolve, reject) => {
    db.query(`INSERT INTO ecommerce.tb_customer_address(
        customer_id,
        address,
        primary_address
        ) VALUES (
            '${data.customer_id}',
            '${data.address}',
            '${data.primary_address}'
        )`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const GetAllCustomerAddress = (customerId) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM ecommerce.tb_customer_address WHERE customer_id = '${customerId}'`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

module.exports = {
  insertAddress: InsertAddress,
  getAllCustomerAddress: GetAllCustomerAddress
}
