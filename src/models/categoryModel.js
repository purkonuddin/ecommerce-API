require('dotenv').config()
const db = require('../configs/db')

const Insert = (data, userId) => {
  return new Promise(function (resolve, reject) {
    db.query(`INSERT INTO tb_categories(
          category_id,
          category_name,
          category_image,
          created_at
          ) VALUES (
              '${data.category_id}',
              '${data.category_name}',
              '${data.category_image}',
              now()
            )`, function (error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const Delete = (categoryId) => {
  return new Promise(function (resolve, reject) {
    db.query(`DELETE FROM tb_categories WHERE category_id = '${categoryId}'`, function (error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const GetById = (categoryId) => {
  return new Promise(function (resolve, reject) {
    db.query(`SELECT * FROM tb_categories WHERE category_id = '${categoryId}'`, function (error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const GetAll = () => {
  return new Promise(function (resolve, reject) {
    db.query('SELECT * FROM tb_categories', function (error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

module.exports = {
  insert: Insert,
  delete: Delete,
  getById: GetById,
  getAll: GetAll
}
