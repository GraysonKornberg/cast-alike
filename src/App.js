import React, { useState, useEffect } from 'react'
import movie1SearchData from './movie1searchdata'
import movie2SearchData from './movie2searchdata'
import movie1CastData from './movie1castdata'
import movie2CastData from './movie2castdata'
import './index.css'

function App() {
  const [firstMovie, setFirstMovie] = useState('')
  const [secondMovie, setSecondMovie] = useState('')
  const [firstId, setFirstId] = useState('')
  const [secondId, setSecondId] = useState('')
  const [movie1Data, setMovie1Data] = useState([])
  const [movie2Data, setMovie2Data] = useState([])
  const [castOverlap, setCastOverlap] = useState([])
  const [displayOverlap, setDisplayOverlap] = useState(false)
  const [alert, setAlert] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const movie1Url = `https://imdb-api.com/API/AdvancedSearch/k_92rp5w04?title=${firstMovie}&title_type=feature,tv_movie,tv_series,tv_miniseries,documentary,short,podcast_series`
    //`https://imdb-api.com/en/API/SearchMovie/k_92rp5w04/${firstMovie}`
    const movie2Url = `https://imdb-api.com/API/AdvancedSearch/k_92rp5w04?title=${secondMovie}&title_type=feature,tv_movie,tv_series,tv_miniseries,documentary,short,podcast_series`
    //`https://imdb-api.com/en/API/SearchMovie/k_92rp5w04/${secondMovie}`

    setMovieIds(movie1Url, movie2Url)
  }

  useEffect(() => {
    if (firstId && secondId) {
      setMovieData(
        `https://imdb-api.com/en/API/FullCast/k_92rp5w04/${firstId}`,
        `https://imdb-api.com/en/API/FullCast/k_92rp5w04/${secondId}`
      )
    }
  }, [secondId])

  useEffect(() => {
    if (movie1Data.length != 0 && movie2Data.length != 0) {
      setCastOverlap(findCastOverlap(movie1Data, movie2Data))
    }
  }, [movie2Data])

  useEffect(() => {
    console.log('cast overlap: ', castOverlap)
    if (castOverlap.length != 0) {
      showOverlap()
    }
  }, [castOverlap])

  const showOverlap = () => {
    if (!alert) {
      setDisplayOverlap(true)
    }
  }

  const setMovieIds = async (url1, url2) => {
    let response = await fetch(url1)
    let data = await response.json()
    setFirstId(data.results[0].id)
    response = await fetch(url2)
    data = await response.json()
    setSecondId(data.results[0].id)
  }

  const setMovieData = async (url1, url2) => {
    let response = await fetch(url1)
    let data = await response.json()
    setMovie1Data(data.actors)
    response = await fetch(url2)
    data = await response.json()
    setMovie2Data(data.actors)
  }

  const findCastOverlap = (actors1, actors2) => {
    const actorSet = new Set()
    let actorIntersect = []
    actors1.map((actor) => {
      actorSet.add(actor.id)
    })
    console.log('actor set: ', actorSet)
    for (var i = 0; i < actors2.length; i++) {
      if (actorSet.has(actors2[i].id)) {
        console.log(i)
        actorIntersect.push(actors2[i])
        setAlert(false)
      }
    }
    console.log('actor overlap: ', actorIntersect)
    if (actorIntersect.length === 0) setAlert(true)
    return actorIntersect
  }

  return (
    <div>
      <div className='title'>
        <h2>Cast Alike</h2>
        <h4>See common actors in different movies</h4>
      </div>
      <div className='form-container'>
        <form onSubmit={handleSubmit}>
          <div className='form-labels'>
            <label htmlFor='movie1'>First movie: </label>
            <input
              type='text'
              id='movei1'
              name='movie1'
              placeholder='Inception 2010'
              value={firstMovie}
              onChange={(e) => setFirstMovie(e.target.value)}
            />
            <label htmlFor='movie2'>Second movie: </label>
            <input
              type='text'
              id='movie2'
              name='movie2'
              placeholder='Tenet 2020'
              value={secondMovie}
              onChange={(e) => setSecondMovie(e.target.value)}
            />
          </div>
          <button type='submit' className='btn'>
            Compare
          </button>
        </form>
      </div>
      <div className='actor-list'>
        {alert && <h4 className='alert'>no overlap</h4>}
        {displayOverlap &&
          !alert &&
          castOverlap.map((actor) => {
            return (
              <div className='actor'>
                <h2>{actor.name}</h2>
                <img src={actor.image} alt={actor.name} />
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default App
