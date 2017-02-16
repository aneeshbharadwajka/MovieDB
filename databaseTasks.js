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
  update: function (sequelize, response, moviename, actor) {
    let query = `UPDATE movies SET actors = concat(actors,', ${actor}') WHERE moviename = '${moviename}';`
    sequelize.query(query)
      .then(function (task) {
        if (task[1].rowCount) {
          // response.send(`The task with id=${moviename} has been updated`)
        } else {
          // response.send(`The task with id=${moviename} doesnt exist to update`)
        }
      })
      .catch(function () {
         console.log('Error in Updating')
      })
  },
  read: function (sequelize, response, moviename) {
    let query = `SELECT moviename,releasedate,actors,studio FROM movies where moviename = '${moviename}';`
    sequelize.query(query)
      .then(function (tasks) {
        //console.log(tasks)
        response.json(tasks[0])
      })
      .catch(function () {
        console.log('Error in reading todo list')
        response.send('Error in reading todo list')
      })
  }
}

module.exports = operation
