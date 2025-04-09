import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Cake, Earth, MarsStroke } from 'lucide-react'
import './Details.css'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY

const ActorDetails = () => {
  const [actor, setActor] = useState(null)
  const [languages, setLanguages] = useState([])

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actorResponse, languagesResponse] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/configuration/languages?api_key=${API_KEY}`)
        ])

        if (!actorResponse.ok) throw new Error('Failed to fetch actor data')
        if (!languagesResponse.ok) throw new Error('Failed to fetch languages data')

        const actorData = await actorResponse.json()
        const languagesData = await languagesResponse.json()

        setActor(actorData)
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

  if (!actor) return null

  return (
    <div className='details-container'>
      <div className='back-button-container'>
        <button className='back-button' onClick={() => navigate(-1)}><ArrowLeft /> Back</button>
      </div>

      <div className='details-content'>
        <div className='columns-container'>
          <div className='info-col'>
            <h1>{actor.name}</h1>
            <p className='tag-line'>{actor.also_known_as?.join(', ')}</p>
            
            <div className='info-item first-item'>
              <Cake size={18} />
              <p><strong>Birthday:</strong> {formatDate(actor.birthday)}</p>
            </div>
            
            <div className='info-item'>
              <Earth size={18} />
              <p><strong>Place of Birth:</strong> {actor.place_of_birth || 'N/A'}</p>
            </div>

            <div className='info-item'>
              <MarsStroke size={18} />
              <p><strong>Gender:</strong> {actor.gender === 1 ? 'Female' : actor.gender === 2 ? 'Male' : 'N/A'}</p>
            </div>
          </div>
          
          <div className='img-col'>
            {actor.profile_path && 
              <img 
                src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} 
                alt={actor.name} 
                className='poster' 
              />
            }
          </div>
        </div>
        
        <div className='sub-section'>
          <h3>Biography</h3>
          <p>{actor.biography || 'No biography available.'}</p>
        </div>
      </div>
    </div>
  )
}

export default ActorDetails