import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Star, Clock, Calendar, Users, BookCopy, Building, Globe, Drama } from 'lucide-react'
import './Details.css'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY

const MovieDetails = () => {
  const [movie, setMovie] = useState(null)
  const [languages, setLanguages] = useState([])

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieResponse, languagesResponse] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/configuration/languages?api_key=${API_KEY}`)
        ])

        if (!movieResponse.ok) throw new Error('Failed to fetch movie data')
        if (!languagesResponse.ok) throw new Error('Failed to fetch languages data')

        const movieData = await movieResponse.json()
        const languagesData = await languagesResponse.json()

        setMovie(movieData)
        setLanguages(languagesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [id])

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Find language name
  const getLanguageName = (code) => {
    if (!code || !languages.length) return 'N/A'
    return languages.find(lang => lang.iso_639_1 === code)?.english_name || code
  }

  if (!movie) return null

  return (
    <div className='details-container'>
      <div className='back-button-container'>
        <button className='back-button' onClick={() => navigate(-1)}><ArrowLeft /> Back</button>
      </div>

      <div className='details-content'>
        <div className='columns-container'>
          <div className='info-col'>
            <h1>{movie.title}</h1>
            {movie.tagline && <h3 className='tagline'>{movie.tagline}</h3>}
            
            <div className='info-item first-item'>
              <Calendar size={18} />
              <p><strong>Release Date:</strong> {formatDate(movie.release_date)}</p>
            </div>
            
            <div className='info-item'>
              <Star size={18} />
              <p><strong>Rating:</strong> {movie.vote_average?.toFixed(1) || 'N/A'}/10 ({movie.vote_count || 0} votes)</p>
            </div>
            
            <div className='info-item'>
              <Clock size={18} />
              <p><strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} minutes` : 'N/A'}</p>
            </div>
            
            <div className='info-item'>
              <Globe size={18} />
              <p><strong>Original Language:</strong> {getLanguageName(movie.original_language)}</p>
            </div>

            <div className='info-item'>
              <BookCopy size={18} />
              <p><strong>Series:</strong> {movie.belongs_to_collection ? movie.belongs_to_collection.name : 'N/A'}</p>
            </div>
            
            <div className='info-item'>
              <Drama size={18} />
              <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(', ') || 'N/A'}</p>
            </div>
            
            <div className='info-item'>
              <Building size={18} />
              <p><strong>Production Companies:</strong> {movie.production_companies?.length 
                ? movie.production_companies.map(company => company.name).join(', ') : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className='img-col'>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className='poster' />
          </div>
        </div>
        
        <div className='sub-section'>
          <h3>Overview</h3>
          <p>{movie.overview || 'No overview available.'}</p>
        </div>
        
        <div className='creators-section'>
          <div className='info-item'>
            <Users size={18} />
            <p><strong>Directed By:</strong> {movie.directors?.length 
              ? movie.directors.map((director) => director.name).join(', ') : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails