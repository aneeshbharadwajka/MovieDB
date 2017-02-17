const axios = require('axios')
const express = require('express')
const app = express()
const operation = require('./databaseTasks')
Array.prototype.diff = function (a) {
  return this.filter(function (i) { return a.indexOf(i) < 0 })
}
const listOfFetchURL = [axios.get('https://movie-api-lyalzcwvbg.now.sh/paramount'), axios.get('https://movie-api-lyalzcwvbg.now.sh/dreamworks'), axios.get('https://movie-api-lyalzcwvbg.now.sh/actors')]

app.get('/movie/:movieName', (req, res) => {
  const name = req.params.movieName
  operation.read(name)
    .then((result) => {
      res.send(result[0])
    })
    .catch(() => {
      res.sendStatus(500)
    })
})
app.get('/fetch', (req, resp) => {
  const movieInfo = []
  const movies = []
  const actorMovieMapping = []
  const movieProduction = []
  Promise.all(listOfFetchURL)
    .then((response) => {
      const URLdataArray1 = response[0].data
      URLdataArray1.forEach((movie) => {
        movieInfo.push(movie)
        movieProduction[movie.movieName] = 'paramount'
      })
      const URLdataArray2 = response[1].data
      URLdataArray2.forEach((movie) => {
        movieInfo.push(movie)
        movieProduction[movie.movieName] = 'dreamworks'
      })
      const actorArray = response[2].data
      actorArray.forEach((actor) => {
        const actMovies = actor.movies
        actMovies.forEach((movie) => {
          if (movies.includes(movie) === false) { movies.push(movie) }
        })
      })
      for (let index = 0; index < movies.length; index++) {
        const temp = []
        actorArray.forEach((actor) => {
          const actMovies = actor.movies
          actMovies.forEach((movie) => {
            if (movie === movies[index]) {
              temp.push(actor.actorName)
            }
          })
        })
        actorMovieMapping.push(`${movies[index]}:${temp}`)
      }
      let names
      let releasedates
      let actors = []
      let studios = ''
      let flag = false
      movieInfo.forEach((movie) => {
        names = movie.movieName
        releasedates = movie.releaseDate
        studios = movieProduction[names]
        for (let index = 0; index < actorMovieMapping.length; index++) {
          const elementMovieActor = actorMovieMapping[index]
          if (elementMovieActor.includes(names)) {
            let tempArray = elementMovieActor.split(':')
            actors = tempArray[1].split(',')
            const insertIntoDB = operation.write(names, studios, releasedates, actors)
            insertIntoDB.then(() => {
              flag = true
            })
              .catch(() => {
                flag = false
              })
          }
        }
      })
      let actorMovies = []
      for (let index = 0; index < actorMovieMapping.length; index++) {
        const elementMovieActor = actorMovieMapping[index]
        let tempArray = elementMovieActor.split(':')
        actorMovies.push(tempArray[0])
      }
      let nameArray = []
      movieInfo.forEach((movie) => {
        names = movie.movieName
        nameArray.push(names)
      })
      let moviesWithNoActors = nameArray.diff(actorMovies)
      var promiseOfInsertion = new Promise((resolve, reject) => {
        movieInfo.forEach((movie) => {
          for (let index = 0; index < moviesWithNoActors.length; index++) {
            if (movie.movieName === (moviesWithNoActors[index])) {
              names = movie.movieName
              releasedates = movie.releaseDate
              studios = movieProduction[names]
              const insertIntoDB = operation.write(names, studios, releasedates, '')
              insertIntoDB.then(() => {
                flag = true
              })
                .catch(() => {
                  flag = false
                })
            }
          }
        })
      })
      promiseOfInsertion.then(() => {
        res.send('Successfully inserted movie data')
      })
      .catch(() => {
        res.send('Problems')
      })
    })
    .catch(() => {
      res.send('Problems')
    })

  resp.send('Successfully inserted movie data')
})
app.listen(3000)
