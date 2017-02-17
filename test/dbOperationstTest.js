const dbTasks = require('../databaseTasks')
const chai = require('chai')
const expect = chai.expect

describe('when read function is called', function () {
  it('should return array of objects', function (done) {
    dbTasks.read('Movie 1')
      .then((data) => {
        expect(data instanceof Array).to.eqls(true)
        done()
      })
  })
})

describe('Valid Insert operation', function () {
  it('should return Success', function (done) {
    dbTasks.write('movie23', 'DreamWorks', 'March-25-2015', ['actor2', 'actor5', 'actor9'])
      .then((data) => {
        expect(data[0].moviename).to.eqls('movie23')
        done()
      })
  })
})

