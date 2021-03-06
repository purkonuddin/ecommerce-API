// const { middleware } = require('express-paginate')
const multer = require('multer')
// const path = require('path')

const EventImage = (req, res, next) => {
  const object = {
    directory: 'src/assets/images/event',
    prefix: 'event-',
    fileUrl: process.env.APP_URL_EVENT,
    currentImages: ''
  }
  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${object.directory}`)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter })
  const uploadFiles = upload.single('image')
  uploadFiles(req, res, err => {
    if (err) {
      return res.send(err)
    }
    let image = ''
    if (req.file === undefined) {
      image = object.currentImages
    } else {
      image = `${object.fileUrl + req.file.filename}`
    }
    req.body.file = image
    req.body.file_prefix = object.prefix

    next()
  })
}

const SingleImage = (req, res, next) => {
  let dateNow = Date.now()
  const regExp = /[^A-Za-z0-9]/g
  const userId = req.userData.user_id
  const userName = req.userData.user_name.toLowerCase().replace(regExp, '')
  const originalUrl = req.originalUrl.split('/')

  const object = originalUrl[4] === 'my-store' ? {
    directory: 'src/assets/images/stores',
    prefix: `${userId}-${req.userData.user_store.toLowerCase().replace(regExp, '')}`,
    fileUrl: process.env.APP_URL_STORE,
    currentImages: req.mystore.length <= 0 ? '' : req.mystore[0].store_image
  } : originalUrl[3] === 'event' ? {
    directory: 'src/assets/images/event',
    prefix: 'event-',
    fileUrl: process.env.APP_URL_EVENT,
    currentImages: ''
  } : originalUrl[3] === 'products' ? {
    directory: 'src/assets/images/products',
    prefix: dateNow,
    fileUrl: process.env.APP_URL_PRODUCTS,
    currentImages: ''
  }:{
    directory: 'src/assets/images/users',
    prefix: `${userId}-${userName}`,
    fileUrl: process.env.APP_URL_PROFILE,
    currentImages: req.body.myprofile[0].user_image
  }

  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${object.directory}`)
    },
    filename: function (req, file, cb) {
      var myfileName = '.jpeg'
      cb(null, `${object.prefix}-${myfileName}`)
    }
  })

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter })
  const uploadFiles = upload.single('image')
  uploadFiles(req, res, err => {
    if (err) {
      return res.send(err)
    }
    // console.log('adfasf=> ', req)
    let image = ''
    if (req.file === undefined) {
      image = object.currentImages
    } else {
      image = `${object.fileUrl + req.file.filename}`
    }
    req.body.file = image
    req.body.file_prefix = object.prefix

    next()
  })
}

const MultipleImages = (req, res, next) => {
  let dateNow = Date.now()
  const regExp = /[^A-Za-z0-9]/g
  const userId = req.userData.user_id
  const userName = req.userData.user_name.toLowerCase().replace(regExp, '')
  const originalUrl = req.originalUrl.split('/')
  const object = originalUrl[3] === 'user' ? {
    // jika upload users
    directory: 'src/assets/images/users',
    prefix: `${userId}-${userName}`,
    fileUrl: process.env.APP_URL_PROFILE,
    currentImages: req.body.myprofile[0].user_image
  } : originalUrl[3] === 'category' ? {
    // jika upload category
    directory: 'src/assets/images/category',
    prefix: 'ctgry',
    fileUrl: process.env.APP_URL_CATEGORY,
    currentImages: ''
  } : originalUrl[3] === 'slide' ? {
    directory: 'src/assets/images/slide',
    prefix: 'slide-' + dateNow,
    fileUrl: process.env.APP_URL_SLIDE,
    currentImages: ''
  } : {
    directory: 'src/assets/images/products',
    prefix: dateNow,
    fileUrl: process.env.APP_URL_PRODUCTS,
    currentImages: ''
  }

  // console.log(object)

  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${object.directory}`)
    },
    filename: function (req, file, cb) {
      // var extFile = path.extname(file.originalname)
      // var basename = file.originalname.replace(`'${extFile}'`, '')

      var myfileName = originalUrl[2] === 'user' ? '.jpeg' : file.originalname.replace(/\s/g, '')
      /**
       * imgs-category/ctgry-icin-4-200x200.png
       * imgs-users/844a3945-314b-4385-932c-e57e30f8abfa-mrscoronavirus.jpeg
       */
      cb(null, `${object.prefix}-${myfileName}`)
    }
  })

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter })
  const uploadFiles = upload.array('images', 5)

  uploadFiles(req, res, err => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.send('Too many files to upload.')
      }
    } else if (err) {
      return res.send(err)
    }

    // console.log('req.files==>>', req);

    /**
     * { fieldname: 'images',
     * originalname: 'blog-3-1000x400.jpg',
     * encoding: '7bit',
     * mimetype: 'image/jpeg',
     * destination: 'src/assets/images/products',
     * filename: '1601217800257-blog-3-1000x400.jpg',
     * path: 'src\\assets\\images\\products\\1601217800257-blog-3-1000x400.jpg',
     * size: 48915
     * }
     */

    const images = req.files.map(image => `${object.fileUrl + image.filename}`).join(', ')
    req.body.files = images !== '' ? images : object.currentImages
    // digunakan sebagai product_id
    req.body.file_prefix = object.prefix

    next()
  })
}

module.exports = {
  uploadMidleware: MultipleImages,
  singleUploadMidleware: SingleImage,
  eventImage: EventImage
}
