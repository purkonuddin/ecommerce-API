require('dotenv').config()
const db = require('../configs/db')

const GetEvents = () => {
  return new Promise(function (resolve, reject) {
    db.query('SELECT * FROM ecommerce.tb_event', function (error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const InsertEvent = (data) => {
  return new Promise(function (resolve, reject) {
    db.query(
          `INSERT INTO ecommerce.tb_event (
            title, 
            location, 
            partisipan, 
            date, 
            description, 
            created_at,
            image) 
          VALUES (
              '${data.title}', 
              '${data.location}', 
              '${data.partisipan}',
              '${data.date}',
              '${data.description}',
              now(),
              '${data.image}')`,
          function (error, result) {
            if (!error) {
              resolve(result)
            } else {
              reject(new Error(error))
            }
          })
  })
}

module.exports = {
  getEvents: GetEvents,
  insertEvent: InsertEvent
}
