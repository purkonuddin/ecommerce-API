const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const gp = require('../helpers/generate-password')
const nodemailer = require('nodemailer')
var async = require('async')
const customerAddressModel = require('../models/customerAddressModel')

const Index = (req, res) => {
  res.json({ name: 'user page' })
}

const Login = (req, res, next) => {
  const Login = userModel.login(req.body.login_email)
  Login.then((result) => {
    if (!result.length) {
      return res.status(401).send({
        msg: 'Email or password is incorrect!'
      })
    }

    //  cek emailverified status 0
    if (result[0].email_verified === '0') {
      return res.status(401).send({
        status: 'email_verified = 0',
        msg: `cek email ${result[0].user_email} untuk verifikasi, atau melalui halaman verifikasi account`
      })
    }

    // check password
    bcrypt.compare(req.body.login_password, result[0].user_password, (bErr, bResult) => {
    //   wrong password
      if (bErr) {
        // throw bErr
        return res.status(401).send({
          msg: 'bErr: Username or password is incorrect!'
        })
      }

      if (bResult) {
        const token = jwt.sign({
          user_name: result[0].user_name,
          user_id: result[0].user_id,
          account_type: result[0].account_type,
          user_store: result[0].user_store
        }, 'SECRETKEY', { expiresIn: '7d' })
        const lastlogin = userModel.setlastlogin(result[0].user_id)
        lastlogin.then(() => {}).catch(err => new Error(err))
        return res.status(200).send({
          msg: 'Logged in!',
          token: token,
          user: result[0]
        })
      }

      return res.status(401).send({
        msg: '!bResult: Username or password is incorrect!',
        bResult,
        userid: result[0].user_id
      })
    })
  }).catch(err => new Error(err))
}

const Logout = (req, res) => {
  if (!req.userData === undefined || req.userData.user_id === '') {
    return res.json({ msg: 'userData undefined' })
  }

  userModel.setemailverifytoken(null, req.userData.user_id).then((result) => {
    if (!result) {
      return res.send({ msg: 'logout error' })
    }

    res.send({
      msg: 'logout',
      result
    })
  }).catch(err => new Error(err))
}

const UpdatePassword = (req, res, next) => {
  const newpwd = req.body.newpassword
  const userData = req.userData
  bcrypt.hash(newpwd, 10, (err, hash) => {
    if (err) {
      return res.status(500).send({
        msg: err
      })
    } else {
      userModel.updatepassword(hash, userData.user_id).then((result) => {
        res.json({
          result: result,
          newpwd: newpwd
        })
      }).catch(err => new Error(err))
    }
  })
}

const ForgetPassword = (req, res, next) => {
  const pwd = gp.generate(8)

  userModel.login(req.body.email).then((result) => {
    if (!result.length) {
      return res.send(`<p>err : email ${req.body.email} tidak terdaftar</p>`)
    }

    const userid = result[0].user_id

    bcrypt.hash(pwd, 10, (err, hash) => {
      if (err) {
        return res.status(500).send({
          msg: err
        })
      } else {
        const password = hash
        userModel.updatepassword(password, userid).then(() => {}).catch(err => new Error(err))
        // return res.send({ pwd: pwd, hash: hash })
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'purkonud12119617@gmail.com',
            pass: 'AmikBsi12119617'
          }
        })
        var mailOptions = {
          to: req.body.email,
          from: 'no-reply@gmail.com',
          subject: 'Email Verification',
          html: `<p>Hai ${result[0].user_email},</p>' +
                <p>password anda telah di perbarui, gunakan untuk login.</p></br>
                <ul>
                <li>id : ${result[0].user_id}</li>
                <li>password : ${pwd}</li>
                <li>nama : ${result[0].user_name}</li> 
                </ul></br>`
        }
        smtpTransport.sendMail(mailOptions, function (err) {
          if (err) {
            console.log(err)
            return res.status(404).send({ err: err })
          }
          // req.flash('SaveSuccess', 'Email Verifikasi telah dikirim ke ' + req.body.useremail)
          return res.status(201).send({
            status: 'forgot password',
            msg: `password telah dikirim ke ${req.body.email}`
          })
        })
      }
    })
  }).catch(err => new Error(err))
}

const SignUp = (req, res, next) => {
  const getusername = userModel.getusername(req.body.username)

  getusername.then((result) => {
    if (result.length) {
      return res.status(409).send({
        msg: 'This username is already in use!'
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
                var smtpTransport = nodemailer.createTransport({
                  service: 'Gmail',
                  auth: {
                    user: 'purkonud12119617@gmail.com',
                    pass: 'AmikBsi12119617'
                  }
                })
                var mailOptions = {
                  to: req.body.useremail,
                  from: 'no-reply@gmail.com',
                  subject: 'Email Verification',
                  html: `<p>Hai ${user.user_email},</p>' +
                      <p>terimakasih telah membuat akun di aplikasi kami.</p></br>
                      <ul>
                      <li>Nama : ${user.user_id}</li>
                      <li>Nama : ${user.user_name}</li>
                      <li>Nama : ${req.body.password}</li>
                      <li>Nama : ${user.account_type}</li>
                      <li>Nama : ${user.user_phone}</li>
                      </ul></br>
                      Silahkan verifikasi email dengan mengklik link berikut:</br>
                      <a href=http://${req.headers.host}/verifikasi-email/${token}>Konfirmasi</a>`
                }
                smtpTransport.sendMail(mailOptions, function (err) {
                  if (err) {
                    console.log(err)
                  }
                  req.flash('SaveSuccess', 'Email Verifikasi telah dikirim ke ' + req.body.useremail)
                  return res.status(201).send({
                    status: 'registered',
                    msg: `Email Verifikasi telah dikirim ke ${req.body.useremail}`
                  })
                })
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
  //   res.json({ token })
  // verifikasi token dengan database user
  const user = userModel.updatemailverifiedstatus(token)
  user.then((result) => {
    res.status(201).send({
      result: result,
      token: token
    })
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
  index: Index,
  login: Login,
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
