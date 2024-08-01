const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const dbpath = path.join(__dirname, 'moviesData.db')
let db = null
app.use(express.json())
const instalizeDbandserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`Db Error : ${e.message}`)
    process.exit(1)
  }
}

instalizeDbandserver()

const convertsnakeTocamelofmovieDetails = db => {
  return {
    movieName: db.movie_name,
    movieId: db.movie_id,
    directorId: db.director_id,
    leadActor: db.lead_actor,
  }
}

const dbObjectofDirectorsnaketoCamel = dbObject => {
  return {
    directorName: dbObject.director_name,
    directorId: dbObject.director_id,
  }
}

app.get('/movies/', async (request, response) => {
  const movieQuery = `
  select movie_name From Movie`

  const moviesNames = await db.all(movieQuery)
  response.send(
    moviesNames.map(i => ({
      movieName: i.movie_name,
    })),
  )
})

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params

  const getmovieQuery = `select * from movie WHERE movie_id=${movieId};`

  const movie = db.get(getmovieQuery)
  response.send(movie)
})
