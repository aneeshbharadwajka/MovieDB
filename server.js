const express = require('express')
const axios = require('axios')
const operation = require('./databaseTasks.js')
const app = express()
const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://aneeshbharadwajka:15226@localhost:5432/testdb')
let listOfURL = ['https://movie-api-lyalzcwvbg.now.sh/paramount',
  'https://movie-api-lyalzcwvbg.now.sh/dreamworks']
let listOfActors = ['https://movie-api-lyalzcwvbg.now.sh/actors']

app.get('/fetch', function (req, res) {
  for (let urlIndex = 0; urlIndex < listOfURL.length; urlIndex++) {
    let array = listOfURL[urlIndex].split('/')
    let studio = array[array.length - 1]
    let actors = ''
    axios.get(listOfURL[urlIndex])
      .then(function (response) {
        for (let index = 0; index < response.data.length; index++) {
          operation.write(sequelize, res, response.data[index].movieName,
            response.data[index].releaseDate, studio, actors)
        }
        // console.log(response.data[0].movieName)
      })
      .catch(function (error) {
        console.log(error)
      })
    for (let actorIndex = 0; actorIndex < listOfActors.length; actorIndex++) {
      axios.get(listOfActors[actorIndex])
      .then(function (response) {
        for (let index = 0; index < response.movies.length; index++) {
          operation.update(sequelize,res,response.movies[index],response.actorName)
        }
      })
    }
  }
})
app.listen(3000)
