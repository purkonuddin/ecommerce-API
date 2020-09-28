// helper/users.js
const jwt = require('jsonwebtoken')
const ValidasiFormEditProfile = (req, res, next) => {
  // user_name min 6 chars
  if (!req.body.user_name || req.body.user_name.length < 6) {
    return res.status(400).send({
      msg: 'Please enter a user_name with min. 6 chars'
    })
  }

  // user_name min 6 chars
  if (!req.body.user_email || req.body.user_email.length < 6) {
    return res.status(400).send({
      msg: 'Please enter a user_email with min. 6 chars'
    })
  }

  // user_phone min 6 chars
  if (!req.body.user_phone || req.body.user_phone.length < 6) {
    return res.status(400).send({
      msg: 'Please enter a user_phone with min. 6 chars'
    })
  }

  // gender min 6 chars
  if (!req.body.gender || req.body.gender.length < 6) {
    return res.status(400).send({
      msg: 'Please enter a gender with min. 6 chars'
    })
  }
  next()
}

module.exports = {
  validasiFormEditProfile: ValidasiFormEditProfile,
  isSeller: (req, res, next) => {
    if (req.userData.account_type === 'customer') {
      return res.status(400).send({
        msg: 'this page for seller'
      })
    }

    next()
  },
  validatePassword: (req, res, next) => {
    // password min 6 chars
    if (!req.body.newpassword || req.body.newpassword.length < 6) {
      return res.status(400).send({
        msg: 'Please enter a password with min. 6 chars'
      })
    }
    // password (repeat) does not match
    if (
      !req.body.newpassword_repeat ||
    req.body.newpassword !== req.body.newpassword_repeat
    ) {
      return res.status(400).send({
        msg: 'Both passwords must match'
      })
    }
    next()
  },
  isLoggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(
        token,
        'SECRETKEY'
      )
      req.userData = decoded
      next()
    } catch (err) {
      return res.status(401).send({
        msg: 'Your session is not valid!'
      })
    }
  },
  validateLogin: (req, res, next) => {
    // cek email
    if (!req.body.login_email || req.body.login_email.length < 6) {
      return res.status(400).send({
        msg: 'Please enter a valid email'
      })
    }

    // cek password
    if (!req.body.login_password || req.body.login_password.length < 6) {
      return res.status(400).send({
        msg: 'Please enter a valid password'
      })
    }
    next()
  },
  validateSignupSeller: (req, res, next) => {
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
    if (!req.body.username || req.body.username.length < 3) {
      return res.status(400).send({
        msg: 'Please enter a username with min. 3 chars'
      })
    }

    // email min length 3
    if (!req.body.useremail || req.body.useremail.length < 3) {
      return res.status(400).send({
        msg: 'Please enter a valid email'
      })
    }

    // phone number
    if (!req.body.userphone || req.body.userphone.length < 10) {
      if (req.body.account_type === 'seller' || req.body.account_type === '1') {
        return res.status(400).send({
          msg: 'Please enter valid phone number'
        })
      }
    }
    // store name
    if (!req.body.userstore || req.body.userstore.length < 3) {
      if (req.body.account_type === 'seller' || req.body.account_type === '1') {
        return res.status(400).send({
          msg: 'Please enter a store name with min. 3 chars'
        })
      }
    }
    // password min 6 chars
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).send({
        msg: 'Please enter a password with min. 6 chars'
      })
    }
    // password (repeat) does not match
    if (
      !req.body.password_repeat ||
        req.body.password !== req.body.password_repeat
    ) {
      return res.status(400).send({
        msg: 'Both passwords must match'
      })
    }

    next()
  }
}
