const chai = require('chai')
const expect = chai.expect
var request = require('request')
describe('Insert into DB operation', function () {
  const options = {
    method: 'GET',
    url: 'http://localhost:3000/fetch',
    headers:
    {
      'postman-token': 'e6b27c03-9194-2db3-c652-d820e7181acf',
      'cache-control': 'no-cache'
    }
  }
  it('should return Success on insertion of all movies', function () {
    request(options, function (error, response, body) {
      if (error) throw new Error(error)
      expect(body).to.eqls('Success')
    })
  })
})

describe('Get operation for a movie not in the database', function () {
  const request = require('request')

  const options = {
    method: 'GET',
    url: 'http://localhost:3000/movie/Movie%202',
    headers:
    {
      'postman-token': 'b7738eb4-9b6b-a518-72bd-54592c3a8059',
      'cache-control': 'no-cache'
    }
  }
  it('should return an empty object', function () {
    request(options, function (error, response, body) {
      if (error) throw new Error(error)
      expect(body).to.eqls('[]')
    })
  })
})

describe('Empty Query', function () {
  const request = require('request')
  const options = {
    method: 'GET',
    url: 'http://localhost:3000/movie/',
    headers:
    {
      'postman-token': 'b7738eb4-9b6b-a518-72bd-54592c3a8059',
      'cache-control': 'no-cache'
    }
  }
  it('should return error', function () {
    request(options, function (error, response, body) {
      if (error) throw new Error(error)
      expect(body).to.eqls('No movie Specified')
    })
  })
})
