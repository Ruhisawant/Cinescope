import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Cake, Earth, MarsStroke, Briefcase, Heart, Star } from 'lucide-react'
import './Details.css'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY

const PeopleDetails = () => {
  const [actor, setActor] = useState(null)
  const [credits, setCredits] = useState(null)

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actorResponse, creditsResponse] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${API_KEY}&language=en-US`)
        ])

        if (!actorResponse.ok) throw new Error('Failed to fetch actor data')
        if (!creditsResponse.ok) throw new Error('Failed to fetch credits data')

        const actorData = await actorResponse.json()
        const creditsData = await creditsResponse.json()

        setActor(actorData)
        setCredits(creditsData)
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

  // Calculate age
  const calculateAge = (birthDate, deathDate) => {
    if (!birthDate) return null
    
    const birth = new Date(birthDate)
    const end = deathDate ? new Date(deathDate) : new Date()
    
    let age = end.getFullYear() - birth.getFullYear()
    const monthDiff = end.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  // Get primary known for department
  const getPrimaryDepartment = () => {
    if (!actor) return 'N/A'
    return actor.known_for_department || 'N/A'
  }

  // Get most popular projects
  const getPopularProjects = () => {
    if (!credits || !credits.cast) return []
    
    return credits.cast.sort((a, b) => b.popularity - a.popularity).slice(0, 5)
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
            {actor.also_known_as?.length > 0 && (
              <p className='tag-line'>Also known as: {actor.also_known_as?.join(', ')}</p>
            )}
            
            <div className='info-item first-item'>
              <Cake size={18} />
              <p>
                <strong>Birthday:</strong> {formatDate(actor.birthday)}
                {calculateAge(actor.birthday, actor.deathday) && ` (${calculateAge(actor.birthday, actor.deathday)} years${actor.deathday ? ' old at death' : ' old'})`}
              </p>
            </div>
            
            {actor.deathday && (
              <div className='info-item'>
                <Heart size={18} />
                <p><strong>Died:</strong> {formatDate(actor.deathday)}</p>
              </div>
            )}

            <div className='info-item'>
              <Earth size={18} />
              <p><strong>Place of Birth:</strong> {actor.place_of_birth || 'N/A'}</p>
            </div>

            <div className='info-item'>
              <MarsStroke size={18} />
              <p><strong>Gender:</strong> {actor.gender === 1 ? 'Female' : actor.gender === 2 ? 'Male' : 'N/A'}</p>
            </div>

            <div className='info-item'>
              <Briefcase size={18} />
              <p><strong>Known For:</strong> {getPrimaryDepartment()}</p>
            </div>

            <div className='info-item'>
              <Star size={18} />
              <p><strong>Popularity:</strong> {actor.popularity.toFixed(1) || 'N/A'}</p>
            </div>
          </div>
          
          <div className='img-col'>
            {actor.profile_path ? (
              <img 
                src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} 
                alt={actor.name} 
                className='poster' 
              />
            ) : (
              <div className='poster-placeholder'>
                No image available
              </div>
            )}
          </div>
        </div>
        
        <div className='sub-section'>
          <h3>Biography</h3>
          <p>{actor.biography || 'No biography available.'}</p>
        </div>

        {getPopularProjects().length > 0 && (
          <div className='sub-section'>
            <h3>Known For</h3>
            <div className='popular-projects'>
              {getPopularProjects().map(project => (
                <div key={project.id} className='project-card'>
                  {project.poster_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w200${project.poster_path}`} 
                      alt={project.title || project.name} 
                      className='project-poster'
                    />
                  ) : (
                    <div className='project-poster-placeholder'>No Image</div>
                  )}
                  <h4>{project.title || project.name}</h4>
                  <p className='project-character'>{project.character || 'Unknown Role'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PeopleDetails