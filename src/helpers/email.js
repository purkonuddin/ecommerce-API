const nodemailer = require('nodemailer')
const helpers = require('./index')

const SendEmail = (req, res, next) => {
  try {
    const userEmail = req.body.user_email
    const emailSubject = req.body.email_subject
    const emailContent = req.body.email_content

    var smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'purkonuddin25@gmail.com',
        pass: 'ArkademyB14'
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
        helpers.customErrorResponse(res, 404, `akun telah dibuat, tapi gagal mengirim email verifikasi. ${err}. atau verifikasi ulang melalui halaman forget password`)
      }
      req.body.object = 'users'
      req.body.action = 'kirim email'
      req.body.message = `Registrasi berhasil, untuk mengaktifkan akun lakukan verifikasi melalui tautan yang kami kirimkan ke alamat email ${userEmail}`
      delete req.body.email_content

      next()
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = SendEmail
