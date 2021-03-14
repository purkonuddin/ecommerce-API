# rajaongkir-node-js
[![Github All Releases](https://img.shields.io/badge/downloads-303-green.svg)](https://github.com/eiyu/rajaongkir-node-js)

Package ini dapat digunakan untuk membuat rest client pada web app anda dan sudah dicoba di framework [express](https://github.com/expressjs/express) dan berjalan dengan baik.

# instalasi
npm install rajaongkir-node-js

# Penggunaan
Inisialisasi
```javascript
const {init} = require('rajaongkir-node-js')
// masukan api-key tipe akun
const request = init('api-key', 'starter')
```

request object memiliki tiga method, get dan post
```javascript
get(path)

post(postType, data,[headers])

postInternational(data,[headers])
```

Package ini mengikuti endpoint yang sama dengan dokumentasi di [rajaongkir](http://rajaongkir.com), akan tetapi path pertama bebas mengunakan nama apa saja.


# Contoh Penggunaan di express js

Menggunakan promise

```javascript
// server
//dependencies
const express = require('express')
const router = express.Router()
const {init} = require('rajaongkir-node-js')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({extended: false})
const request = init('apiKey', 'starter')
//express
var app = express()
	app.use('/', router)

	router.post('/path/cost',urlencodedParser, function(req, res) {
	const {body,headers} = req
	// headers argument is optional
		const cost = request.post('cost',body,headers)
		cost.then(x => {
				res.write(x)
				res.end()
		}
	)
});

router.post('/path/waybill',urlencodedParser, function(req, res) {
const {body,headers} = req
// headers argument is optional
	const cost = request.post('waybill',body,headers)
	cost.then(x => {
			res.write(x)
			res.end()
	}
)
});

	router.get('/path/:query', function(req, res) {
		const{url} = req
		const regionType = request.get(url)
		regionType.then(x => {
				res.write(x)
				res.end()
		}
		)
	})

	router.get('/path/:region/:query', function(req, res) {
		const{url} = req
		const regionType = request.get(url)
		regionType.then(x => {
				res.write(x)
				res.end()
		}
		)
	})

		router.get('/form', function(req, res) {
			res.send(`
					<html>
						<head>
						<title> testing form </title>

						<script>
						const submit = () => {
						document.getElementById('form').submit()
						console.log('submit')
						}

						</script>
						</head>
						<body>
							<form id="form" action="path/cost" method="post">
								<input name="origin" type="number" placeholder="input id kota origin" /> <br/>
								<input name="originType" type="text" placeholder="tipe kota origin" /> <br/>
								<input name="destination" type="number" placeholder="input id kota tujuan" /> <br/>
								<input name="destinationType" type="text" placeholder="tipe kota tujuan" /> <br/>
								<input name="weight" type="integer" placeholder="masukan berat (gr)" /> <br/>
								<input name="courier" type="text" placeholder="periksa ongkir" /> <br/>
								<input type="submit" onclick="submit()"> Submit </input>
							</form>
						</body>
					</html>
				`)
			res.end()
		})

// node server
var server = app.listen(8080, function() {
	console.log("server berjalan di http://localhost:8080")
})

```

Contoh penggunaan diluar server, tidak disarankan karena api key akan terekspose.
```javascript
const {init} = require('rajaongkir-node-js')
const request = init('apiKey', 'starter')

// get
const province = request.get('/province')
province.then(prov => {
	console.log(prov);
})
// menggunakan query
const allCityInProvince = request.get('/city?&province=1')
allCityInProvince.then(city => console.log(city))

const specificCityInProvince = request.get('/city?id=39&province=5')

const currency = request('/currency') // path currency hanya tersedia di akun pro
province.then(curr => {
	console.log(curr);
})

const international = request.get('v2/internationalDestination?id=108') // akun pro
														 .then(nation => console.log(nation))


// post
const data = {
  origin: 501,
  destination: 114,
  weight: 1700,
  courier: 'jne:pos' // bisa merequest satu atau beberapa kurir sekaligus
}
const cost = request.post('cost',data)
cost.then(cst => {
	console.log(cst);
})

const dataResi = { waybill: 'SOCAG00183235715', courier: 'jne' }
const resi = request.post('waybill',dataResi)
resi.then(wb => {
	console.log(wb);
})

const intData = {
	origin: '152',
  destination: '108',
  weight: 1400,
  courier: 'pos'
}
//post international
postInternational(data,[headers]) // hanya tersedia di akun pro
const internationalCost = request.postInternational(intData)
internationalCost.then(cost => console.log(cost);)
```
