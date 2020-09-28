require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')

const port = process.env.PORT || 8080

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   )
//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET,UPDATE')
//     return res.status(200).json({})
//   }

var whitelist = ['http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(session({
  resave: false, // express-session deprecated undefined resave option; provide resave option index.js:15:9
  saveUninitialized: true, // express-session deprecated undefined saveUninitialized option; provide saveUninitialized option index.js:15:9
  secret: 'hubwiz app',
  cookie: { maxAge: 60 * 1000 * 30 }
}))

app.use(flash()) // flash memerlukan cookie dan session

app.use('/imgs-products', express.static('./src/assets/images/products'))
app.use('/imgs-users', express.static('./src/assets/images/users'))
app.use('/imgs-category', express.static('./src/assets/images/category'))
app.use('/imgs-slide', express.static('./src/assets/images/slide'))

app.get('/', (req, res) => res.send('Hello world with express and nodemon'))
// add routes
const apiRouter = require('./src/routers')

app.use('/api', apiRouter)

app.listen(port, function () {
  console.log(`Running resthub with port ${port}`)
})
