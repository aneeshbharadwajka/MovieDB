const express = require('express')
const axios = require('axios')
const operation = require('./databaseTasks.js')
const app = express()
let movieActorData = []
let listOfURL = ['https://movie-api-lyalzcwvbg.now.sh/paramount',
  'https://movie-api-lyalzcwvbg.now.sh/dreamworks']
const movies = []
const getActors = () => axios.get('https://movie-api-lyalzcwvbg.now.sh/actors')

getActors()
  .then((response) => {
    const actorArray = response.data
    actorArray.forEach((actor) => {
      const actMovies = actor.movies
      actMovies.forEach((movie) => {
        if (movies.includes(movie) === false) { movies.push(movie) }
      })
    })
    // console.log(movies)
    for (let iter = 0; iter < movies.length; iter++) {
      const temp = []

      // console.log(movies[iter])
      actorArray.forEach((actor) => {
        const actMovies = actor.movies
        actMovies.forEach((movie, index) => {
          if (movie === movies[iter]) {
            temp.push(actor.actorName)
          }
        })
      })
      // console.log(temp)
      movieActorData.push(`${movies[iter]}-${temp}`)
    }
    // console.log(movieActorData)
  })
  .catch((error) => {
    console.log(error)
  })

app.get('/fetch', function (req, res) {
  for (let urlIndex = 0; urlIndex < listOfURL.length; urlIndex++) {
    let temporaryArray = listOfURL[urlIndex].split('/')
    let studio = temporaryArray[temporaryArray.length - 1]
    let actors
    axios.get(listOfURL[urlIndex])
      .then(function (response) {
        for (let index = 0; index < response.data.length; index++) {
          for (let iter = 0; iter < movieActorData.length; iter++) {
            const elementMovieActor = movieActorData[iter]
            if (elementMovieActor.includes(response.data[index].movieName)) {
              let tempArray = elementMovieActor.split('-')
              actors = tempArray[1].split(',')
              console.log(actors)
              operation.write(response.data[index].movieName,
                response.data[index].releaseDate, studio, actors)
                .then((response) => {
                  console.log('Successfully Inserted')
                })
                .catch((error) => {
                  console.log(error.toString())
                })
            }
          }
        }
      })
    res.send('Success')
  }
})

app.get('/movie/:movieName', function (req, res) {
  let movieName = req.params.movieName
  console.log(req.params.movieName)
  if (movieName === '') {
    res.send('No movie specified')
  } else {
    operation.read(movieName)
    .then((data) => {
      res.json(data[0])
    })
    .catch((error) => {
      res.send('Not present in the DB' + error.toString())
    })
  }
})

app.listen(3000)

