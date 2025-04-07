import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import './MovieDetails.css'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY

const MovieDetails = () => {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)

	const navigate = useNavigate()

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`)
        if (!res.ok) throw new Error('Failed to fetch movie data')
        const data = await res.json()
        setMovie(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchMovie()
  }, [id])

  if (!movie) return <div>Loading...</div>

  return (
    <div className='details-container'>
			<div className='back-button-container'>
				<button className='back-button' onClick={() => navigate(-1)}><ArrowLeft /></button>
			</div>
	    <div className='details-content'>
        <h1>{movie.title}</h1>
        <div className='columns-container'>
          <div className='info-col'>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Rating:</strong> {movie.vote_average.toFixed(1)}</p>
            <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
            <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
          </div>
          <div className='img-col'>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          </div>
        </div>
          <p><strong>Overview:</strong> {movie.overview}</p>
					<p><strong>Homepage:</strong> {movie.homepage ? (<a href={movie.homepage}>{movie.homepage}</a>) : (<span> N/A</span>)}</p>
				</div>
    </div>
  ) 
}

export default MovieDetails