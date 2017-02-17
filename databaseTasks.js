const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://aneeshbharadwajka:15226@localhost:5432/testdb')

let operation = {
  write: function (moviename, releasedate, studio, actors) {
    const query = `INSERT INTO movies (moviename, studio, releasedate, actors) VALUES (:name,:studio,:release,ARRAY[:actors]) RETURNING moviename`
    const insertDB = sequelize.query(query, { replacements: { name: moviename, studio: studio, release: releasedate, actors: actors } })
    return insertDB
  },
  read: function (moviename) {
    let query = `SELECT moviename,releasedate,actors,studio FROM movies where moviename = :name;`
    const readDB = sequelize.query(query, { replacements: { name: moviename } })
    return readDB
  }
}

module.exports = operation
// operation.write('movie9', 'DreamWorks', 'March-25-2015', ['actor2', 'actor5', 'actor9']).then((data) => console.log('1', data))
//   .catch((data) => console.log('2', data))
