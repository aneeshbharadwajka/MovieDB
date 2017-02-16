const axios = require('axios')
axios.get('https://movie-api-lyalzcwvbg.now.sh/paramount')
  .then(function (response) {
    console.log(response.data[0].movieName)
  })
  .catch(function (error) {
    console.log(error)
  })

