require('dotenv').config()
const db = require('../configs/db')
const uuid = require('uuid')

const updatepassword = (password, userid) => {
  return new Promise((resolve, reject) => {
    db.query(`UPDATE ecommerce.tb_user SET user_password = '${password}' WHERE user_id= '${userid}'`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const setlastlogin = (userid) => {
  return new Promise((resolve, reject) => {
    db.query(`UPDATE ecommerce.tb_user SET last_login = now() WHERE user_id= '${userid}'`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const login = (email, accounType) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM ecommerce.tb_user WHERE user_email = '${email}' AND account_type = '${accounType}'`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const setemailverifytoken = (token, userid) => {
  return new Promise((resolve, reject) => {
    db.query(`UPDATE ecommerce.tb_user SET email_verify_token = '${token}',  email_verified ='0' WHERE user_id='${userid}'`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const updatemailverifiedstatus = (token) => {
  return new Promise(function (resolve, reject) {
    db.query(`UPDATE ecommerce.tb_user SET email_verified ='1' WHERE email_verify_token='${token}'`, function (error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const getusername = (username) => {
  return new Promise(function (resolve, reject) {
    db.query(`SELECT * FROM ecommerce.tb_user WHERE LOWER(user_name) = LOWER(${db.escape(username)})`, function (error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const insertnewuser = (data) => {
  return new Promise(function (resolve, reject) {
    db.query(
        `INSERT INTO ecommerce.tb_user (
            user_id, 
            user_name, 
            user_email, 
            user_phone, 
            user_store, 
            user_password, 
            registered_at, 
            last_login, 
            user_image,
            email_verified,
            account_type) 
        VALUES (
            '${uuid.v4()}', 
            '${data.user_name}', 
            '${data.user_email}',
            '${data.user_phone}',
            '${data.user_store}',
            '${data.user_password}', 
            now(),
            NULL,
            NULL,
            '0',
            '${data.account_type}')`,
        function (error, result) {
          if (!error) {
            resolve(result)
          } else {
            reject(new Error(error))
          }
        })
  })
}

const UpdateProfile = (data, userId) => {
  return new Promise(function (resolve, reject) {
    db.query('UPDATE ecommerce.tb_user SET ? WHERE user_id = ?', [data, userId], function (error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const GetMyProfile = (userId, action) => {
  const originalUrl = action
  const strQueryA = `SELECT user_name, user_email, user_phone, gender,date_of_birth ,a.address AS primary_address, user_store, user_image, account_type FROM ecommerce.tb_user u, ecommerce.tb_customer_address a WHERE u.user_id = '${userId}' AND a.customer_id = '${userId}' AND a.primary_address = 'true'`
  const strQueryB = `SELECT user_name, user_email, user_phone, gender,date_of_birth , primary_address, user_store, user_image, account_type FROM ecommerce.tb_user WHERE user_id = '${userId}'`
  // (localhost:8001/api/user) => req.originalUrl.split('/')[3] = [undefined]
  console.log(strQueryA)
  const strQuery = originalUrl === undefined ? strQueryB : strQueryB

  // console.log(originalUrl)
  return new Promise(function (resolve, reject) {
    db.query(strQuery, function (error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const GetFieldAlreadyInUse = (username, email, phone) => {
  return new Promise(function (resolve, reject) {
    db.query(`SELECT * FROM ecommerce.tb_user WHERE LOWER(user_name) = LOWER(${db.escape(username)}) OR user_email = '${email}' OR user_phone = '${phone}'`, function (error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

module.exports = {
  updateProfile: UpdateProfile,
  updatepassword: updatepassword,
  setlastlogin: setlastlogin,
  login: login,
  setemailverifytoken: setemailverifytoken,
  updatemailverifiedstatus: updatemailverifiedstatus,
  getusername: getusername,
  insertnewuser: insertnewuser,
  getMyProfile: GetMyProfile,
  getFieldAlreadyInUse: GetFieldAlreadyInUse
}
