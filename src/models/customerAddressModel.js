const db = require('../configs/db')

const InsertAddress = (data) => {
  return new Promise((resolve, reject) => {
    db.query(`INSERT INTO ecommerce.tb_customer_address(
        customer_id,
        address,
        primary_address,
        city_id,
        province_id,
        city_name,
        province_name,
        recipient_name,
        recipient_phone_number,
        postal_code
        ) VALUES (
            '${data.customer_id}',
            '${data.address}',
            '${data.primary_address}',
            '${data.city_id}',
            '${data.province_id}',
            '${data.city_name}',
            '${data.province_name}',
            '${data.recipient_name}',
            '${data.recipient_phone_number}',
            '${data.postal_code}'
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
