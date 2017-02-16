let operation = {
  write: function (sequelize, response, moviename, releasedate, studio, actors) {
    sequelize.query(`INSERT INTO movies (moviename, releasedate, actors, studio) VALUES ('${moviename}','${releasedate}','${actors}','${studio}')`)
      .then(function (task) {
        response.status(200)
      })
      .catch(function (err) {
        console.log('Error in Inserting', err)
        response.send('Error in Inserting', err)
      })
  },

  readItems: function (sequelize, response) {
    sequelize.query('SELECT id,description,status FROM tasks order by id',
      { type: sequelize.QueryTypes.SELECT })
      .then(function (tasks) {
        response.json(tasks)
      })
      .catch(function () {
        console.log('Error in reading todo list')
        response.send('Error in reading todo list')
      })
  },
  update: function (sequelize, response, moviename, actor) {
    let query = `UPDATE movies set actor = concat(actor,'${actor}') WHERE moviename = '${moviename});`
    sequelize.query(query)
      .then(function (task) {
        if (task[1].rowCount) {
          response.send(`The task with id=${moviename} has been updated`)
        } else {
          response.send(`The task with id=${moviename} doesnt exist to update`)
        }
      })
      .catch(function () {
        response.send('Error in Updating')
      })
  }
}

module.exports = operation
