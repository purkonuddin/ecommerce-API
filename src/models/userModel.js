require('dotenv').config()
const db = require('../configs/db')
const uuid = require('uuid')

const updatepassword = (password, userid) => {
  return new Promise((resolve, reject) => {
    db.query(`UPDATE tb_user SET user_password = '${password}' WHERE user_id= '${userid}'`, (error, result) => {
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
    db.query(`UPDATE tb_user SET last_login = now() WHERE user_id= '${userid}'`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const login = (email) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM tb_user WHERE user_email = '${email}'`, (error, result) => {
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
    db.query(`UPDATE tb_user SET email_verify_token = '${token}' WHERE user_id='${userid}'`, (error, result) => {
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
    db.query(`UPDATE tb_user SET email_verified ='1' WHERE email_verify_token='${token}'`, function (error, result) {
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
    db.query(`SELECT * FROM tb_user WHERE LOWER(user_name) = LOWER(${db.escape(username)})`, function (error, result) {
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
        `INSERT INTO tb_user (
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
    db.query('UPDATE tb_user SET ? WHERE user_id = ?', [data, userId], function (error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
    })
  })
}

const GetMyProfile = (userId) => {
  return new Promise(function (resolve, reject) {
    db.query(`SELECT user_name, user_email, user_phone, gender,date_of_birth ,a.address AS primary_address, user_store, user_image, account_type FROM tb_user u, tb_customer_address a WHERE u.user_id = '${userId}' AND a.customer_id = '${userId}' AND a.primary_address = 'true'`, function (error, result) {
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
  getMyProfile: GetMyProfile
}
