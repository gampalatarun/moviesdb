const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const dbpath = path.join(__dirname, 'moviesData.db')
let db = null
module.exports = app
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

const convertsnakeTocamelCaseofmovieDetails = db => {
  return {
    movieName: db.movie_name,
    movieId: db.movie_id,
    directorId: db.director_id,
    leadActor: db.lead_actor,
  }
}

const convertDirectorDetailsSnaketocamelCase = db => {
  return {
    directorName: dbObject.director_name,
    directorId: dbObject.director_id,
  }
}

app.get('/movies/', async (request, response) => {
  const movieQuery = `
  select movie_name from movie;`

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

  const getmovieDetails = await db.get(getmovieQuery)
  response.send(convertsnakeTocamelCaseofmovieDetails(getmovieDetails))
})

app.post('/movies/', async (request, response) => {
  const {directorId, movieName, leadActor} = request.body
  const postmovieQuery = `INSERT INTO
    movie( director_id , movie_name , lead_actor) 
  VALUES (${directorId},
   '${movieName}',
    '${leadActor}'
    );`
  await db.run(postmovieQuery)
  response.send('Movie Successfully Added')
})
