const db = require('../configs/db')

const Insert = (data) => {
  return new Promise(function (resolve, reject) {
    db.query(`INSERT INTO ecommerce.tb_slide(
        slide_id,
        slide_name,
        slide_image,
        url,
        aktif
        ) VALUES (
            '${data.slide_id}',
            '${data.slide_name}',
            '${data.slide_image}',
            '${data.url}',
            '1'
          )`, function (error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

module.exports = {
  insert: Insert
}
