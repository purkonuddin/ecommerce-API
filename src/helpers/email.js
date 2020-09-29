const nodemailer = require('nodemailer')

const SendEmail = (req, res, next) => {
  const userEmail = req.body.user_email
  const emailSubject = req.body.email_subject
  const emailContent = req.body.email_content

  var smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'purkonud12119617@gmail.com',
      pass: 'AmikBsi12119617'
    }
  })
  var mailOptions = {
    to: userEmail,
    from: 'no-reply@gmail.com',
    subject: emailSubject,
    html: emailContent
  }

  smtpTransport.sendMail(mailOptions, function (err) {
    if (err) {
      return res.status(404).send({
        result: {
          object: 'users',
          action: `forgot password, send password to ${userEmail}`,
          msg: 'periksa koneksi internet, gagal mengirim pesan',
          err: err
        }
      })
    }

    req.body.object = 'users'
    req.body.action = 'forgot password'
    req.body.msg = `password telah dikirim ke ${req.body.email}`
    next()
  })
}

module.exports = SendEmail
