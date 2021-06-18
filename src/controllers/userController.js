const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const gp = require('../helpers/generate-password')
var async = require('async')
const customerAddressModel = require('../models/customerAddressModel')
const crypto = require('crypto')
const helpers = require('../helpers')

const LoginRev = async (req, res, next) => {
  try {
    const loginEmail = req.body.login_email
    const loginPassword = req.body.login_password
    const loginAccountType = req.body.login_account_type

    const [results] = await Promise.all([
      userModel.login(loginEmail, loginAccountType)
    ])

    // console.log(results)
    if (results.length <= 0) {
      helpers.customErrorResponse(res, 400, `Email ${loginEmail} belum terdaftar sebagai ${loginAccountType}!`)
    } else {
      //  cek emailverified status 0
      if (results[0].email_verified === '0' || results[0].email_verified === 0) {
        helpers.customErrorResponse(res, 400, `cek email ${results[0].user_email} untuk verifikasi, atau verifikasi ulang melalui halaman forget password`)
      } else {
        // check password
        bcrypt.compare(loginPassword, results[0].user_password, (bErr, bResult) => {
          if (bErr) {
            // throw bErr
            helpers.customErrorResponse(res, 401, bErr)
          }

          if (bResult === false) {
            // false
            helpers.customErrorResponse(res, 400, 'Password is incorrect!')
          } else {
            const userData = {
              user_name: results[0].user_name,
              user_id: results[0].user_id,
              account_type: results[0].account_type,
              user_store: results[0].user_store
            }

            const token = jwt.sign(userData, 'SECRETKEY', { expiresIn: '7d' })

            const lastlogin = userModel.setlastlogin(results[0].user_id)
            lastlogin.then(() => {}).catch(err => new Error(err))
            req.body.object = 'user'
            req.body.action = 'login'
            req.body.message = 'login success'
            req.body.user_id = results[0].user_id
            req.body.user_name = results[0].user_name
            req.body.account_type = results[0].account_type
            req.body.user_store = results[0].user_store
            req.body.user_image = results[0].user_image
            req.body.token = token
            req.body.user_email = results[0].user_email
            req.body.user_phone = results[0].user_phone
            req.body.gender = results[0].gender
            req.body.date_of_birth = results[0].date_of_birth
            delete req.body.login_password
            delete req.body.windowWidth
            delete req.body.isSentResetPassword
            delete req.body.login_account_type
            delete req.body.login_email

            next()
          }
        })
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const Logout = async (req, res, next) => {
  try {
    const userId = req.userData.user_id
    const [results] = await Promise.all([
      userModel.setemailverifytoken(null, userId)
    ])

    if (results.affectedRows <= 0) {
      helpers.customErrorResponse(res, 400, 'gagal logout')
    } else {
      const userData = {
        user_name: null,
        user_id: null,
        account_type: null,
        user_store: null
      }

      req.body.object = 'users'
      req.body.action = 'logout'
      req.body.message = 'logout success'
      req.userData = userData

      next()
    }
  } catch (error) {
    console.log(error)
  }
}

const UpdatePassword = async (req, res, next) => {
  try {
    const newpwd = req.body.newpassword
    const userId = req.userData.user_id
    bcrypt.hash(newpwd, 10, (err, hash) => {
      if (err) {
        return res.status(500).send({
          msg: err
        })
      } else {
        const updatePassword = userModel.updatepassword(hash, userId)
        updatePassword.then((result) => {
          if (result.affectedRows <= 0) {
            helpers.customErrorResponse(res, 400, 'gagal update password')
          } else {
            req.body.object = 'users'
            req.body.action = 'update password'
            req.body.message = 'password updated success'
            req.body.user = req.userData
            req.body.newpassword = newpwd

            next()
          }
        }).catch(err => new Error(err))
      }
    })
  } catch (error) {
    console.log(error)
  }
}

const ForgetPassword = async (req, res, next) => {
  try {
    const pwd = gp.generate(8)
    const userEmail = req.body.email

    const [results] = await Promise.all([
      userModel.login(userEmail)
    ])

    if (results.length <= 0) {
      helpers.customErrorResponse(res, 400, `email ${req.body.email} tidak terdaftar`)
    } else {
      const userid = results[0].user_id
      const userName = results[0].user_name

      bcrypt.hash(pwd, 10, (err, hash) => {
        if (err) {
          helpers.customErrorResponse(res, 500, err)
        } else {
          const password = hash
          userModel.updatepassword(password, userid).then((result) => {
            if (result.affectedRows !== 1 && result.changedRows !== 1) {
              helpers.customErrorResponse(res, 400, 'gagal update password')
            } else {
              // kirim email
              const emailContent = `<p>Hai ${userEmail},</p>
              <p>password anda telah di perbarui, gunakan untuk login.</p></br>
              <ul>
                <li>nama : ${userName}</li>
                <li>password : ${pwd}</li>
              </ul>`

              req.body.email_content = emailContent
              req.body.email_subject = 'Email Verification'
              req.body.user_name = userName
              req.body.user_email = userEmail

              next()
            }
          }).catch(err => new Error(err))
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

const SignUp = (req, res, next) => {
  const userName = req.body.username
  const userEmail = req.body.useremail
  const userPhone = req.body.user_phone
  const getusername = userModel.getFieldAlreadyInUse(userName, userEmail, userPhone)

  getusername.then((result) => {
    if (result.length) {
      result.forEach(element => {
        const inUse = element.user_name === userName ? 'username' : element.user_email === userEmail ? 'email' : 'phone number'
        helpers.customErrorResponse(res, 400, `This ${inUse} is already in use!`)
      })
    } else {
      // username is available
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).send({
            msg: err
          })
        } else {
          // has hashed pw => add to database
          const newUser = {
            user_name: req.body.username,
            user_email: req.body.useremail,
            user_phone: req.body.user_phone || null,
            user_store: req.body.userstore || null,
            user_password: hash,
            user_image: null,
            account_type: req.body.account_type
          }
          const insertnewuser = userModel.insertnewuser(newUser)
          insertnewuser.then((result) => {
            // kirim email verifikasi
            async.waterfall([
              function (done) {
                // membuat token
                crypto.randomBytes(20, function (err, buf) {
                  var token = buf.toString('hex')
                  done(err, token)
                })
              },
              // memasukkan nilai token ke dalam user document
              function (token, done) {
                const User = userModel.getusername(req.body.username)
                User.then((result) => {
                  const user = result[0]
                  try {
                    //   set token
                    userModel.setemailverifytoken(token, user.user_id)
                  } catch (error) {
                    helpers.customErrorResponse(res, 500, error)
                  }
                  done(err, token, user)
                }).catch()
              },
              // kirim email konfirmasi ke user
              function (token, user, done) {
                const userEmail = req.body.useremail
                const emailSubject = 'Email Verification'
                const emailContent = `<p>Hai ${user.user_email},</p>
                <p>terimakasih telah membuat akun di aplikasi kami.</p></br>
                <ul>
                <li>user_id : ${user.user_id}</li>
                <li>user_name : ${user.user_name}</li>
                <li>password : ${req.body.password}</li>
                <li>account_type : ${user.account_type}</li>
                <li>user_phone : ${user.user_phone}</li>
                </ul></br>
                Silahkan verifikasi email dengan mengklik link berikut
                <a href=http://${req.headers.host}/api/v1/user/verifikasi-email/${token}>Konfirmasi</a>`

                req.body.user_email = userEmail
                req.body.email_subject = emailSubject
                req.body.email_content = emailContent
                delete req.body.password
                delete req.body.password_repeat

                next()
              }
            ])
          }).catch(err => {
            throw err
          })
        }
      })
    }
  }).catch(err => {
    throw err
  })
}

const VerifikasiEmail = function (req, res, next) {
  try {
    const token = req.params.token
    console.log(token)
    const user = userModel.updatemailverifiedstatus(token)
    user.then((result) => {
      console.log(result)
      if (result.affectedRows !== 1 && result.changedRows !== 1) {
        helpers.customErrorResponse(res, 400, 'gagal verifikasi')
      } else {
        req.body.object = 'users'
        req.body.action = 'verifikasi email'
        req.body.msg = 'verifikasi berhasil, silahkan login untuk melanjutkan'
        next()
      }
    }).catch((error) => {
      console.log(error)
    })
  } catch (error) {
    console.log(error)
  }
}

const GetUserById = async (req, res, next) => {
  try {
    const originalUrl = req.originalUrl.split('/')
    const userId = req.userData.user_id
    const [results] = await Promise.all([
      userModel.getMyProfile(userId, originalUrl[3])
    ])
    req.body.object = 'user'
    req.body.action = 'get my profile data'
    req.body.myprofile = results
    // console.log(results)

    next()
  } catch (error) {
    console.log(error)
  }
}

const EditProfile = async (req, res, next) => {
  try {
    const userId = req.userData.user_id
    const dataUser = {
      // user_name: req.body.user_name,
      // user_email: req.body.user_email,
      user_phone: req.body.user_phone,
      gender: req.body.gender,
      date_of_birth: req.body.date_of_birth,
      user_image: req.body.file
    }
    // console.log('==>> ', dataUser, userId)
    const [results] = await Promise.all([
      userModel.updateProfile(dataUser, userId)
    ])

    if (results.changedRows !== 1 && results.affectedRows !== 1) {
      helpers.customErrorResponse(res, 400, `tidak ada data di update untuk UserId ${userId}`)
    } else {
      req.body.object = 'users'
      req.body.msg = `user dengan ID ${userId} telah diupdate`
      next()
    }
  } catch (error) {
    console.log(error)
  }
}

const InsertAddress = async (req, res, next) => {
  try {
    const userId = req.userData.user_id
    const dataAddress = {
      customer_id: userId,
      save_address_as: req.body.save_address_as,
      address: req.body.address,
      primary_address: req.body.primary_address,
      city_id: req.body.city_id || null,
      province_id: req.body.province_id || null,
      city_name: req.body.city_name || null,
      province_name: req.body.province_name || null,
      recipient_name: req.body.recipient_name || null,
      recipient_phone_number: req.body.recipient_phone_number || null,
      postal_code: req.body.postal_code || null
    }

    const [insertAddress] = await Promise.all([
      customerAddressModel.insertAddress(dataAddress)
    ])

    if (insertAddress.affectedRows !== 1) {
      helpers.customErrorResponse(res, 400, 'tidak ada data yang ditambahkan')
    } else {
      req.body.object = 'customer_address'
      req.body.action = 'insert'
      req.body.message = 'post new user\'s address is fulfilled'
      req.body.id = insertAddress.insertId
      req.body.user_id = userId
      req.body.result = insertAddress

      next()
    }
  } catch (error) {
    console.log(error)
  }
}

const GetAllCustomerAddress = async (req, res, next) => {
  try {
    const userId = req.userData.user_id

    const [address] = await Promise.all([
      customerAddressModel.getAllCustomerAddress(userId)
    ])

    if (address.length <= 0) {
      helpers.customErrorResponse(res, 400, 'belum ada alamat rumah yang ditambahkan')
    } else {
      req.body.object = 'customer_address'
      req.body.action = 'get my address'
      req.body.message = 'get user\' address is fulfilled'
      req.body.result = address

      next()
    }
  } catch (error) {
    console.log(error)
  }
}

const SendResetLinkByEmail = async (req, res, next) => {
  try {
    const accounType = req.body.account_type
    const resetEmail = req.body.email
    const cekEmailUser = userModel.login(resetEmail, accounType)
    cekEmailUser.then((results) => {
      if (results.length <= 0) {
        helpers.customErrorResponse(res, 400, `email ${req.body.email} tidak terdaftar`)
      } else {
        async.waterfall([
          function (done) {
            crypto.randomBytes(20, function (err, buf) {
              var token = buf.toString('hex')
              done(err, token)
            })
          },
          async function (token, done) {
            const setToken = await userModel.setemailverifytoken(token, results[0].user_id)
            // console.log('@@header:', req.headers)
            if (setToken.changedRows === 1 && setToken.affectedRows === 1) {
              const userEmail = req.body.email
              const emailSubject = 'Email Verification'
              const emailContent = `<p>Hai ${results[0].user_email},</p>
              <p>Akun anda telah terdaftar sebagai:}.</p></br>
              <ul>
              <li>user_id : ${results[0].user_id}</li>
              <li>user_name : ${results[0].user_name}</li>
              <li>account_type : ${results[0].account_type}</li>
              <li>user_phone : ${results[0].user_phone}</li>
              </ul></br>
              Silahkan reset password dengan mengklik link berikut <a href=${req.headers.origin}/reset_password/${token}?id=${results[0].user_id}&email=${userEmail}>Reset password</a>
              Manual link: <code>${req.headers.origin}/reset_password/${token}?id=${results[0].user_id}&email=${userEmail}</code>
              `
              req.body.user_email = userEmail
              req.body.email_subject = emailSubject
              req.body.email_content = emailContent
              delete req.body.email
              delete req.body.windowWidth

              next()
            } else {
              helpers.customErrorResponse(res, 400, 'gagal set token, silahkan ulanngi lagi')
            }
          }
        ])
      }
    }).catch(err => {
      throw err
    })
  } catch (error) {
    console.log(error)
  }
}

const ResetPassword = async (req, res, next) => {
  try {
    const newpwd = req.body.newpassword
    const userId = req.body.user_id
    bcrypt.hash(newpwd, 10, (err, hash) => {
      if (err) {
        return res.status(500).send({
          msg: err
        })
      } else {
        const updatePassword = userModel.updatepassword(hash, userId)
        updatePassword.then((result) => {
          if (result.affectedRows <= 0) {
            helpers.customErrorResponse(res, 400, 'gagal update password')
          } else {
            req.body.object = 'users'
            req.body.action = 'update password'
            req.body.message = 'reset password success'
            req.body.user = req.userData
            delete req.body.newpassword
            delete req.body.newpassword_repeat
            delete req.body.token
            delete req.body.windowWidth

            next()
          }
        }).catch(err => new Error(err))
      }
    })
  } catch (error) {
    console.log(error)
  }
}

const InsertDataMyStore = async (req, res, next) => {
  let toko = []

  try {
    toko = req.mystore
    // console.log('mystore=> ', toko.length)
    const userId = req.userData.user_id
    const dataStore = {
      user_id: userId,
      store_name: req.body.store_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      store_description: req.body.store_description,
      store_image: req.body.file
    }
    // jika sudah ada akan di update data tb_store nya
    // jika belum tambahkan data ke tb_store
    console.log('InsertNewStore==> ', dataStore)
    if (toko.length <= 0) {
      const [results] = await Promise.all([
        userModel.insertNewStore(dataStore)
      ])
      if (results.affectedRows !== 1) {
        helpers.customErrorResponse(res, 400, 'gagal menyimpan')
      } else {
        delete req.userData
        req.body.object = 'store'
        req.body.action = 'post to tb_store'
        req.body.results = results
        req.body.message = 'success'
        next()
      }
    } else {
      const [results] = await Promise.all([
        userModel.updateStore(dataStore, userId)
      ])
      if (results.changedRows !== 1 && results.affectedRows !== 1) {
        helpers.customErrorResponse(res, 400, 'gagal updated')
      } else {
        delete req.userData
        req.body.object = 'store'
        req.body.action = 'update user\'s store'
        req.body.results = results
        req.body.message = 'success'
        next()
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const GetStoreById = async (req, res, next) => {
  try {
    const userId = req.userData.user_id
    const [results] = await Promise.all([
      userModel.getMyStore(userId)
    ])
    req.body.object = 'store'
    req.body.action = 'get my store\'s data'
    req.mystore = results
    if (results.length > 0) {
      req.body.id = results[0].id
      req.body.store_name = results[0].store_name
      req.body.email = results[0].email
      req.body.phone_number = results[0].phone_number
      req.body.store_image = results[0].store_image
      req.body.store_description = results[0].store_description
    }
    // console.log('mystore ==> ', results.length)

    next()
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  login: LoginRev,
  logout: Logout,
  updatePassword: UpdatePassword,
  forgetPassword: ForgetPassword,
  signUp: SignUp,
  verifikasiEmail: VerifikasiEmail,
  getUserById: GetUserById,
  editProfile: EditProfile,
  insertAddress: InsertAddress,
  getAllCustomerAddress: GetAllCustomerAddress,
  sendResetLinkByEmail: SendResetLinkByEmail,
  resetPassword: ResetPassword,
  insertStoreData: InsertDataMyStore,
  getStoreById: GetStoreById
}
