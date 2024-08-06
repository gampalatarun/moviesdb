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

//API1

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
//API3

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params

  const getmovieQuery = `select * from movie WHERE movie_id=${movieId};`

  const getmovieDetails = await db.get(getmovieQuery)
  response.send(convertsnakeTocamelCaseofmovieDetails(getmovieDetails))
})

//API2
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

//API4

app.put('/movies/:movieId/', async (request, response) => {
  const {directorId, movieName, leadActor} = request.body //always request the moviename and directorname while using
  const {movieId} = request.params
  const updatemovieQuery = `
  UPDATE 
  movie
   SET 
   director_id=${directorId},
   movie_name='${movieName}',
   lead_actor='${leadActor}'

   WHERE movie_id=${movieId};
  
  `
  await db.run(updatemovieQuery)
  response.send('Movie Details Updated')
})




//API5

app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deletemovieQuery = `
  DELETE 
  FROM movie
  WHERE movie_id=${movieId};
  `
  await db.run(deletemovieQuery)
  response.send('Movie Removied')
})

//API6

app.get('/directors/', async (request, response) => {
  const getdirectorsQuery = `
  SELECT * FROM director
  
  `
  const getdirectorDetails = await db.all(getdirectorsQuery)
  response.send(getdirectorDetails)
})

//AP7

app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getdirectoridQuery = `
  
  SELECT  movie_name FROM movie WHERE director_id=${directorId}`
  const getdirectorMovieDetails = await db.get(getdirectoridQuery)
  response.send(getdirectorMovieDetails)
})

