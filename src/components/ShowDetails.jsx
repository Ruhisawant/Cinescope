import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Star, Clock, Calendar, Users, Film, Building, Globe, Drama } from 'lucide-react'
import './Details.css'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY

const ShowDetails = () => {
  const [show, setShow] = useState(null)
  const [languages, setLanguages] = useState([])

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [showResponse, languagesResponse] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/configuration/languages?api_key=${API_KEY}`)
        ])

        if (!showResponse.ok) throw new Error('Failed to fetch show data')
        if (!languagesResponse.ok) throw new Error('Failed to fetch languages data')

        const showData = await showResponse.json()
        const languagesData = await languagesResponse.json()

        setShow(showData)
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

  if (!show) return null

  const totalEpisodes = show.seasons?.reduce((acc, season) => acc + (season.episode_count || 0), 0) || 0

  return (
    <div className='details-container'>
      <div className='back-button-container'>
        <button className='back-button' onClick={() => navigate(-1)}><ArrowLeft /> Back</button>
      </div>
      
      <div className='details-content'>
        <div className='columns-container'>
          <div className='info-col'>
            <h1>{show.name}</h1>
            {show.tagline && <h3 className='tagline'>{show.tagline}</h3>}
            
            <div className='info-item first-item'>
              <Calendar size={18} />
              <p><strong>First Air Date:</strong> {formatDate(show.first_air_date)}</p>
            </div>
            
            <div className='info-item'>
              <Star size={18} />
              <p><strong>Rating:</strong> {show.vote_average?.toFixed(1) || 'N/A'}/10 ({show.vote_count || 0} votes)</p>
            </div>
            
            <div className='info-item'>
              <Clock size={18} />
              <p><strong>Runtime:</strong> {show.episode_run_time && show.episode_run_time.length > 0 
                ? `${show.episode_run_time[0]} minutes` : 'N/A'}
              </p>
            </div>
            
            <div className='info-item'>
              <Globe size={18} />
              <p><strong>Original Language:</strong> {getLanguageName(show.original_language)}</p>
            </div>
            
            <div className='info-item'>
              <Film size={18} />
              <p><strong>Seasons:</strong> {show.seasons?.length || 0}, <strong>Episodes:</strong> {totalEpisodes}</p>
            </div>
            
            <div className='info-item'>
              <Drama size={18} />
              <p><strong>Genres:</strong> {show.genres?.map(g => g.name).join(', ') || 'N/A'}</p>
            </div>
            
            <div className='info-item'>
              <Building size={18} />
              <p><strong>Production Companies:</strong> {show.production_companies?.length 
                ? show.production_companies.map(company => company.name).join(', ') : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className='img-col'>
            <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} className='poster' />
          </div>
        </div>
        
        <div className='sub-section'>
          <h3>Overview</h3>
          <p>{show.overview || 'No overview available.'}</p>
        </div>
        
        <div className='creators-section'>
          <div className='info-item'>
            <Users size={18} />
            <p><strong>Created By:</strong> {show.created_by?.length 
              ? show.created_by.map((creator) => creator.name).join(', ') : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowDetails