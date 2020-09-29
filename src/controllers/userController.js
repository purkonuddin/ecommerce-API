const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const gp = require('../helpers/generate-password')
var async = require('async')
const customerAddressModel = require('../models/customerAddressModel')
const crypto = require('crypto')

const LoginRev = async (req, res, next) => {
  const loginEmail = req.body.login_email
  const loginPassword = req.body.login_password

  const [results] = await Promise.all([
    userModel.login(loginEmail)
  ])

  // console.log(results)
  if (results.length <= 0) {
    return res.status(401).send({
      object: 'users',
      action: 'login',
      msg: 'Email or password is incorrect!'
    })
  }

  //  cek emailverified status 0
  if (results[0].email_verified === '0') {
    return res.status(401).send({
      object: 'users',
      action: 'login',
      msg: `cek email ${results[0].user_email} untuk verifikasi, atau melalui halaman verifikasi account`
    })
  }

  // check password
  bcrypt.compare(loginPassword, results[0].user_password, (bErr, bResult) => {
    if (bErr) {
      // throw bErr
      return res.status(401).send({
        object: 'users',
        action: 'login',
        msg: 'Username or password is incorrect!'
      })
    }

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
    req.body.msg = null
    req.body.user_id = results[0].user_id
    req.body.user_name = results[0].user_name
    req.body.account_type = results[0].account_type
    req.body.user_store = results[0].user_store
    req.body.user_image = results[0].user_image
    req.body.token = token
    req.body.login_password = results[0].user_password
    req.body.login_email = results[0].user_email

    next()
  })
}

const Logout = async (req, res, next) => {
  const userId = req.userData.user_id
  const [results] = await Promise.all([
    userModel.setemailverifytoken(null, userId)
  ])

  // console.log(results)
  /**
   * fieldCount: 0,
   * affectedRows: 1,
   * insertId: 0,
   * serverStatus: 2,
   * warningCount: 0,
   * message: '(Rows matched: 1  Changed: 0  Warnings: 0',
   * protocol41: true,
   * changedRows: 0
   */

  if (results.affectedRows <= 0) {
    return res.send({
      object: 'user',
      action: 'logout',
      msg: 'gagal logout'
    })
  }

  const userData = {
    user_name: null,
    user_id: null,
    account_type: null,
    user_store: null
  }

  req.body.object = 'users'
  req.body.action = 'logout'
  req.body.msg = null
  req.userData = userData

  next()
}

const UpdatePassword = async (req, res, next) => {
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
          return res.send({
            object: 'user',
            action: 'update password',
            msg: 'gagal update password'
          })
        }

        req.body.object = 'users'
        req.body.action = 'update password'
        req.body.msg = null
        req.body.user = req.userData
        req.body.newpassword = newpwd

        next()
      }).catch(err => new Error(err))
    }
  })
}

const ForgetPassword = async (req, res, next) => {
  const pwd = gp.generate(8)
  const userEmail = req.body.email

  const [results] = await Promise.all([
    userModel.login(userEmail)
  ])

  if (results.length <= 0) {
    return res.send({
      object: 'user',
      action: 'forgot password',
      msg: `email ${req.body.email} tidak terdaftar</p>`
    })
  }

  const userid = results[0].user_id
  const userName = results[0].user_name

  bcrypt.hash(pwd, 10, (err, hash) => {
    if (err) {
      return res.status(500).send({
        msg: err
      })
    } else {
      const password = hash
      userModel.updatepassword(password, userid).then((result) => {
        // console.log(result)
        /*
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        serverStatus: 2,
        warningCount: 0,
        message: '(Rows matched: 1  Changed: 1  Warnings: 0',
        protocol41: true,
        changedRows: 1
        */

        if (result.affectedRows !== 1 && result.changedRows !== 1) {
          return res.send({
            result: {
              object: 'users',
              action: 'forgot password',
              msg: 'gagal update password'
            }
          })
        }

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
      }).catch(err => new Error(err))
    }
  })
}

const SignUp = (req, res, next) => {
  const userName = req.body.username
  const userEmail = req.body.useremail
  const userPhone = req.body.userphone
  // const getusername = userModel.getusername(userName)
  const getusername = userModel.getFieldAlreadyInUse(userName, userEmail, userPhone)

  getusername.then((result) => {
    if (result.length) {
      result.forEach(element => {
        const inUse = element.user_name === userName ? 'username' : element.user_email === userEmail ? 'email' : 'phone number'
        return res.status(409).send({
          msg: `This ${inUse} is already in use!`
        })
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
            user_phone: req.body.userphone || null,
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
                    return res.status(500).send({
                      status: 'userModule.setemailverifytoken()',
                      msg: error
                    })
                  }
                  done(err, token, user)
                }).catch()
              },
              // kirim email konfirmasi ke user
              function (token, user, done) {
                const userEmail = req.body.useremail
                const emailSubject = 'Email Verification'
                const emailContent = `<p>Hai ${user.user_email},</p>' +
                <p>terimakasih telah membuat akun di aplikasi kami.</p></br>
                <ul>
                <li>user_id : ${user.user_id}</li>
                <li>user_name : ${user.user_name}</li>
                <li>password : ${req.body.password}</li>
                <li>account_type : ${user.account_type}</li>
                <li>user_phone : ${user.user_phone}</li>
                </ul></br>
                Silahkan verifikasi email dengan mengklik link berikut:</br>
                <a href=http://${req.headers.host}/verifikasi-email/${token}>Konfirmasi</a>`

                req.body.user_email = userEmail
                req.body.email_subject = emailSubject
                req.body.email_content = emailContent
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
  const token = req.params.token
  const user = userModel.updatemailverifiedstatus(token)
  user.then((result) => {
    if (result.affectedRows !== 1 && result.changedRows !== 1) {
      return res.send({
        result: {
          object: 'users',
          action: 'verifikasi email',
          msg: 'gagal verifikasi'
        }
      })
    }

    req.body.object = 'users'
    req.body.action = 'verifikasi email'
    req.body.msg = 'verifikasi berhasil, silahkan login untuk melanjutkan'
    next()
  }).catch((error) => {
    console.log(error)
  })
}

const GetUserById = async (req, res, next) => {
  const userName = req.userData.user_id
  const [results] = await Promise.all([
    userModel.getMyProfile(userName)
  ])
  req.body.object = 'user'
  req.body.action = 'get my profile data'
  req.body.myprofile = results

  next()
}

const EditProfile = async (req, res, next) => {
  const userId = req.userData.user_id
  const dataUser = {
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    user_phone: req.body.user_phone,
    gender: req.body.gender,
    date_of_birth: req.body.date_of_birth,
    user_image: req.body.files
  }
  const [results] = await Promise.all([
    userModel.updateProfile(dataUser, userId)
  ])

  if (results.changedRows !== 1 && results.affectedRows !== 1) {
    return res.send({
      object: 'user',
      action: 'edit my profile data',
      msg: `tidak ada data di update untuk UserId ${userId} `
    })
  }

  req.body.object = 'users'
  req.body.msg = `user dengan ID ${userId} telah diupdate`
  next()
}

const InsertAddress = async (req, res, next) => {
  const userId = req.userData.user_id
  const dataAddress = {
    customer_id: userId,
    address: req.body.address,
    primary_address: req.body.primary_address
  }

  const [insertAddress] = await Promise.all([
    customerAddressModel.insertAddress(dataAddress)
  ])

  if (insertAddress.affectedRows !== 1) {
    return res.send({
      object: 'customer_address',
      action: 'insert',
      msg: 'tidak ada data yang ditambahkan'
    })
  }

  req.body.object = 'customer_address'
  req.body.action = 'insert'
  req.body.msg = null
  req.body.id = insertAddress.insertId
  req.body.user_id = userId

  next()
}

const GetAllCustomerAddress = async (req, res, next) => {
  const userId = req.userData.user_id

  const [address] = await Promise.all([
    customerAddressModel.getAllCustomerAddress(userId)
  ])

  if (address.length <= 0) {
    return res.send({
      object: 'customer_address',
      action: 'insert',
      msg: 'tidak ada data yang ditampilkan'
    })
  }

  req.body.object = 'customer_address'
  req.body.action = 'get my address'
  req.body.msg = null
  req.body.customer_address = address

  next()
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
  getAllCustomerAddress: GetAllCustomerAddress
}
