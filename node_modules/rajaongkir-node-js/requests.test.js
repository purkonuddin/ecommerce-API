const {init} = require('./index')
const assert = require('assert')
/* global it, describe */
const apiKey = "api-key"
const accountType = "account-type"
const request = init(apiKey,accountType)

// region type city by default
const dataStarter = {
    origin: 501,
    destination: 114,
    weight: 1700,
    courier: 'jne' // multiple courier not suported on starter
}

// region type must be declared
const dataPro = {
    origin: 501,
    originType: 'subdistrict',
    destination: 114,
    destinationType: 'subdistrict',
    weight: 1700,
    courier: 'jne:pos:jnt' // multiple courier
}
const dataInt = {
  origin: '152',
  destination: '108',
  weight: 1400,
  courier: 'pos'
}

const dataWaybil = { waybill: 'SOCAG00183235715', courier: 'jne' }

describe('rajaongkir service', function() {
  // set timeout to 15sec because there many api calls
  this.timeout(15000)
  it('should consume rajaongkir api starter, basic, pro', (done) => {
        const testGetAllProvince = request.get('/province').then(prov => {
            const response = JSON.parse(prov)
            assert.equal(response.hasOwnProperty('rajaongkir'), true)
            assert.equal(response.rajaongkir.status.code, 200)
            assert.equal(response.rajaongkir.status.description, "OK")
            assert.equal(response.rajaongkir.results[0].hasOwnProperty('province_id'),true)
            assert.equal(response.rajaongkir.results[0].hasOwnProperty('province'),true)
        })

        const testGetSpesificProvince = request.get('/province?id=1').then(prov => {
            const response = JSON.parse(prov)
            assert.equal(response.hasOwnProperty('rajaongkir'), true)
            assert.equal(response.rajaongkir.status.code, 200)
            assert.equal(response.rajaongkir.status.description, "OK")
            assert.equal(response.rajaongkir.results.hasOwnProperty('province_id'),true)
            assert.equal(response.rajaongkir.results.hasOwnProperty('province'),true)
            assert.equal(response.rajaongkir.results.province_id,1)
            assert.equal(response.rajaongkir.results.province,'Bali')
        })
        const testGetAllCityInProvince = request.get('/city?&province=1').then(prov => {
            const response = JSON.parse(prov)
            assert.equal(response.hasOwnProperty('rajaongkir'), true)
            assert.equal(response.rajaongkir.status.code, 200)
            assert.equal(response.rajaongkir.status.description, "OK")
            assert.equal(response.rajaongkir.results[0].hasOwnProperty('province_id'),true)
            assert.equal(response.rajaongkir.results[0].hasOwnProperty('province'),true)
            assert.equal(response.rajaongkir.results[0].hasOwnProperty('city_id'),true)
            assert.equal(response.rajaongkir.results[0].hasOwnProperty('city_name'),true)
        })

        const testGetSpesificCity = request.get('/city?id=17&province=1').then(prov => {
            const response = JSON.parse(prov)
            assert.equal(response.hasOwnProperty('rajaongkir'), true)
            assert.equal(response.rajaongkir.status.code, 200)
            assert.equal(response.rajaongkir.status.description, "OK")
            assert.equal(response.rajaongkir.results.hasOwnProperty('province_id'),true)
            assert.equal(response.rajaongkir.results.hasOwnProperty('province'),true)
            assert.equal(response.rajaongkir.results.hasOwnProperty('type'),true)
            assert.equal(response.rajaongkir.results.city_id,17)
            assert.equal(response.rajaongkir.results.city_name,'Badung')
        })
        const testNotMatchQuery = request.get('/city?id=1&province=1').then(prov => {
            const response = JSON.parse(prov)
            assert.equal(response.hasOwnProperty('rajaongkir'), true)
            assert.equal(response.rajaongkir.status.code, 200)
            assert.equal(response.rajaongkir.status.description, "OK")
            assert.equal(response.rajaongkir.results.length,0)
        })

        const costStarter = request.post('cost',dataStarter).then(cost => {
          const response = JSON.parse(cost)
          assert.equal(response.hasOwnProperty('rajaongkir'), true)
          assert.equal(response.rajaongkir.status.code, 200)
          assert.equal(response.rajaongkir.status.description, "OK")
          assert.equal(response.rajaongkir.query.toString(), dataStarter.toString())
          assert.equal(response.rajaongkir.results[0].costs[0].cost[0].hasOwnProperty('value'), true)
        })

        Promise.all([
          testGetAllProvince,
          testGetSpesificProvince,
          testGetAllCityInProvince,
          testGetSpesificCity,
          testNotMatchQuery,
          costStarter
        ])
        .then(res => done())
        .catch(done)
      })


// // pro account test
it('should consume rajaongkir api pro', (done) => {
      const testGetSpesificSubdistrict = request.get('/subdistrict?id=1&city=1').then(prov => {
          const response = JSON.parse(prov)
          assert.equal(response.hasOwnProperty('rajaongkir'), true)
          assert.equal(response.rajaongkir.status.code, 200)
          assert.equal(response.rajaongkir.status.description, "OK")
          assert.equal(response.rajaongkir.results.hasOwnProperty('province_id'),true)
          assert.equal(response.rajaongkir.results.hasOwnProperty('province'),true)
          assert.equal(response.rajaongkir.results.subdistrict_id,1)
          assert.equal(response.rajaongkir.results.subdistrict_name,'Arongan Lambalek')
      })

      const testGetAllSubdistrictInCity = request.get('/subdistrict?&city=1').then(prov => {
          const response = JSON.parse(prov)
          assert.equal(response.hasOwnProperty('rajaongkir'), true)
          assert.equal(response.rajaongkir.status.code, 200)
          assert.equal(response.rajaongkir.status.description, "OK")
          assert.equal(response.rajaongkir.results[0].hasOwnProperty('subdistrict_id'),true)
          assert.equal(response.rajaongkir.results[0].hasOwnProperty('subdistrict_name'),true)
          assert.equal(response.rajaongkir.results[0].hasOwnProperty('city_id'),true)
          assert.equal(response.rajaongkir.results[0].hasOwnProperty('city'),true)
      })


      const costPro = request.post('cost',dataPro).then(cost => {
        const response = JSON.parse(cost)
        assert.equal(response.hasOwnProperty('rajaongkir'), true)
        assert.equal(response.rajaongkir.status.code, 200)
        assert.equal(response.rajaongkir.status.description, "OK")
        assert.equal(response.rajaongkir.query.toString(), dataPro.toString())
        assert.equal(response.rajaongkir.results[0].costs[0].cost[0].hasOwnProperty('value'), true)
      })

      const internationalCost = request.postInternational(dataInt).then(cost => {
        const response = JSON.parse(cost)
        assert.equal(response.hasOwnProperty('rajaongkir'), true)
        assert.equal(response.rajaongkir.status.code, 200)
        assert.equal(response.rajaongkir.status.description, "OK")
        assert.equal(response.rajaongkir.query.toString(), dataPro.toString())
        assert.equal(response.rajaongkir.results[0].costs[0].hasOwnProperty('service'), true)
        assert.equal(response.rajaongkir.results[0].costs[0].hasOwnProperty('cost'), true)
        assert.equal(response.rajaongkir.results[0].costs[0].hasOwnProperty('currency'), true)
      })

      const waybill = request.post('waybill', dataWaybil).then(resi => {
          const response = JSON.parse(resi)
          assert.equal(response.hasOwnProperty('rajaongkir'), true)
          assert.equal(response.rajaongkir.status.code, 200)
          assert.equal(response.rajaongkir.status.description, "OK")
          assert.equal(response.rajaongkir.query.toString(), dataWaybil.toString())
          assert.equal(response.rajaongkir.result.hasOwnProperty('summary'), true)
          assert.equal(response.rajaongkir.result.hasOwnProperty('details'), true)
          assert.equal(response.rajaongkir.result.hasOwnProperty('delivery_status'), true)
          assert.equal(response.rajaongkir.result.hasOwnProperty('manifest'), true)
          assert.equal(response.rajaongkir.result.summary.status, 'DELIVERED')
      })

      Promise.all([
        testGetAllSubdistrictInCity,
        testGetSpesificSubdistrict,
        costPro,
        internationalCost,
        waybill
      ])
      .then(res => done())
      .catch(done)
    })
  });
