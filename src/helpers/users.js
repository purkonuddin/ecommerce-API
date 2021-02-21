// helper/users.js
const helpers = require('./index')
const jwt = require('jsonwebtoken')
const regexEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{5,}$/
const regexField = /^\w+([ ]?\w+)+$/

const ValidasiFormEditProfile = (req, res, next) => {
  // user_name min 6 chars
  if (!req.body.user_name || req.body.user_name.length < 6) {
    helpers.customErrorResponse(res, 400, 'Please enter a user_name with min. 6 chars')
  }

  const validateEmailReg = regexEmail.test(req.body.user_email)

  // user_name min 6 chars
  if (!req.body.user_email || !validateEmailReg) {
    helpers.customErrorResponse(res, 400, 'Please enter a valid email')
  }

  // user_phone min 6 chars
  if (req.body.user_phone.length > 9 && req.body.user_phone.length < 13 && req.body.user_phone.substr(0, 1) === '8' && !isNaN(req.body.user_phone)) {
    helpers.customErrorResponse(res, 400, 'Please enter a phone number ')
  }

  // gender min 6 chars
  if (!req.body.gender || req.body.gender.length < 6) {
    helpers.customErrorResponse(res, 400, 'Please enter a gender enum(pria, wanita)')
  }
  next()
}

const isSeller = (req, res, next) => {
  if (req.userData.account_type === 'customer') {
    helpers.customErrorResponse(res, 400, 'this page for seller')
  }

  next()
}

const validatePassword = (req, res, next) => {
  const validatePasswordReg = regexPassword.test(req.body.newpassword)

  // password min 6 chars
  if (!req.body.newpassword || !validatePasswordReg) {
    helpers.customErrorResponse(res, 400, 'gunakan alpha numeric, 1 uppercase, 1 lowercase, min 6 character')
  }
  // password (repeat) does not match
  if (
    !req.body.newpassword_repeat ||
  req.body.newpassword !== req.body.newpassword_repeat
  ) {
    helpers.customErrorResponse(res, 400, 'Both passwords must match')
  }
  next()
}

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(
      token,
      'SECRETKEY'
    )
    req.userData = decoded
    next()
  } catch (err) {
    helpers.customErrorResponse(res, 400, 'Your session is not valid!')
  }
}

const validateLogin = (req, res, next) => {
  const validateEmailReg = regexEmail.test(req.body.login_email)

  // cek email
  if (!req.body.login_email || !validateEmailReg) {
    helpers.customErrorResponse(res, 400, 'Please enter a valid email')
  }

  // cek password
  if (!req.body.login_password || req.body.login_password.length < 6) {
    helpers.customErrorResponse(res, 400, 'Please enter a valid password')
  }
  next()
}

const validateSignup = (req, res, next) => {
  const validateEmailReg = regexEmail.test(req.body.useremail)
  const validateStringReg = regexField.test(req.body.userstore)
  const validatePasswordReg = regexPassword.test(req.body.password)

  // account type seller or customer
  if (!req.body.account_type) {
    req.body.account_type = 'customer'
  } else {
    if (req.body.account_type === '0' || req.body.account_type === 'customer') {
      req.body.account_type = 'customer'
    } else {
      req.body.account_type = 'seller'
    }
  }

  // username min length 3
  if (!req.body.username || req.body.username.length < 3 || !regexField.test(req.body.username)) {
    helpers.customErrorResponse(res, 400, 'Please enter a username with min. 3 chars without single quote')
  } else if (!req.body.useremail || !validateEmailReg) {
    helpers.customErrorResponse(res, 400, 'Please enter a valid email')
  } else if ((req.body.account_type === 'seller' || req.body.account_type === '1') && (!req.body.user_phone || req.body.user_phone.length < 9 || req.body.user_phone.length > 13 || req.body.user_phone.substr(0, 1) !== '8' || isNaN(req.body.user_phone))) {
    helpers.customErrorResponse(res, 400, 'Please enter valid phone number, numeric, 8xxxx..., min 9, max 13 character')
  } else if ((req.body.account_type === 'seller' || req.body.account_type === '1') && (!req.body.userstore || req.body.userstore.length < 3 || !validateStringReg)) {
    helpers.customErrorResponse(res, 400, 'Please enter a store name with min. 3 chars with no singgle quotes')
  } else if (!req.body.password || !validatePasswordReg) {
    helpers.customErrorResponse(res, 400, 'gunakan alpha numeric, 1 uppercase, 1 lowercase, min 6 character')
  } else {
    next()
  }
}

const validateEmail = (req, res, next) => {
  try {
    const validateEmailReg = regexEmail.test(req.body.email)

    // account type seller or customer
    if (!req.body.account_type) {
      req.body.account_type = 'customer'
    } else {
      if (req.body.account_type === '0' || req.body.account_type === 'customer') {
        req.body.account_type = 'customer'
      } else {
        req.body.account_type = 'seller'
      }
    }

    // cek email
    if (!req.body.email || !validateEmailReg) {
      helpers.customErrorResponse(res, 400, 'Please enter a valid email')
    }

    next()
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  validasiFormEditProfile: ValidasiFormEditProfile,
  isSeller: isSeller,
  validatePassword: validatePassword,
  isLoggedIn: isLoggedIn,
  validateLogin: validateLogin,
  validateSignup: validateSignup,
  validateEmail: validateEmail
}
