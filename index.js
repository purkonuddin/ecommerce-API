require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
// const session = require('express-session')
// const flash = require('express-flash')
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('./src/swagger-spec.json')
const compress = require('compression')
const helmet = require('helmet')
const logger = require('morgan')
const app = express()

const port = process.env.PORT || 8001
const IP = process.env.IP

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

// var whitelist = ['http://localhost:3000']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
var options = { customCss: '.swagger-ui .topbar { display: none }' }
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument, options))

app.use(helmet())
app.use(compress())
app.use(cors())
app.listen(port, () => console.log(`\n This server is running on port ${port}, and use IP ${IP}`))
app.use(logger('dev'))

// app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// app.use(session({
//   resave: false, // express-session deprecated undefined resave option; provide resave option index.js:15:9
//   saveUninitialized: true, // express-session deprecated undefined saveUninitialized option; provide saveUninitialized option index.js:15:9
//   secret: 'hubwiz app',
//   cookie: { maxAge: 60 * 1000 * 30 }
// }))

// app.use(flash()) // flash memerlukan cookie dan session

app.use('/imgs-products', express.static('./src/assets/images/products'))
app.use('/imgs-users', express.static('./src/assets/images/users'))
app.use('/imgs-category', express.static('./src/assets/images/category'))
app.use('/imgs-slide', express.static('./src/assets/images/slide'))
app.use('/imgs-store', express.static('./src/assets/images/stores'))
app.use('/imgs-event', express.static('./src/assets/images/event'))

app.get('/', (req, res) => res.send('RestFull Api with nodejs, expressjs, mysql and sweger testing for Ecommerce Service'))
// add routes
const apiRouter = require('./src/routers')

app.use('/api/v1/', apiRouter)
