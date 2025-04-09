import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown } from 'lucide-react'
import './AllContent.css'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY

const Actors = () => {
  const [actors, setActors] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedGender, setSelectedGender] = useState('')
  const [selectedAge, setSelectedAge] = useState('')

  const navigate = useNavigate()

  // Function to calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return null
    const birthYear = new Date(birthdate).getFullYear()
    const currentYear = new Date().getFullYear()
    return currentYear - birthYear
  }

  // Fetch actors
  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=en-US&page=${currentPage}`)
        if (!response.ok) throw new Error('Failed to fetch actors')
        
        const data = await response.json()
        const newActors = data.results
        
        const actorsWithDetails = await Promise.all(
          newActors.map(async (actor) => {
            try {
              const detailResponse = await fetch(`https://api.themoviedb.org/3/person/${actor.id}?api_key=${API_KEY}&language=en-US`)
              if (!detailResponse.ok) return actor
              
              const detailData = await detailResponse.json()
              return { ...actor, birthday: detailData.birthday }
            } catch (error) {
              console.error(`Error fetching details for actor ${actor.id}:`, error.message)
              return actor
            }
          })
        )
        
        setActors((prevActors) => {
          const existingIds = new Set(prevActors.map(a => a.id))
          const newUniqueActors = actorsWithDetails.filter(actor => !existingIds.has(actor.id))
          return [...prevActors, ...newUniqueActors]
        })
      } catch (error) {
        console.error('Error fetching actors:', error.message)
      }
    }

    fetchActors()
  }, [currentPage])

  // Filter actors based on user inputs
  const filterActors = (actors) => {
    return actors.filter(actor => {
      const matchesSearch = searchQuery ? (actor.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) : true
      const matchesGender = selectedGender ? actor.gender === Number(selectedGender) : true
      
      let matchesAge = true
      if (selectedAge) {
        const actorAge = actor.birthday ? calculateAge(actor.birthday) : null
        
        if (actorAge === null) {
          matchesAge = false
        } else if (selectedAge === '60+') {
          matchesAge = actorAge >= 60
        } else {
          const [minAge, maxAge] = selectedAge.split('-').map(Number)
          matchesAge = actorAge >= minAge && actorAge <= maxAge
        }
      }

      return matchesSearch && matchesGender && matchesAge
    })
  }

  // Reset all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedGender('')
    setSelectedAge('')
    document.querySelector('.search-input').value = ''
  }

  // Load more actors by incrementing page number
  const loadMoreActors = () => {
    setCurrentPage((prevPage) => prevPage + 1)
  }

  return (
    <div>
      {/* Header */}
      <header className='header'>
        <div className='search-container'>
          <span className='search-icon'><Search size={18} /></span>
          <input 
            type='text'
            placeholder='Search actors...'
            className='search-input'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <h1>All Actors & Actresses</h1>
      </header>

      {/* Main Actor Content */}
      <main className='content'>
        <div className='filters-row'>
          {/* Gender Filter */}
          <div className='select-wrapper'>
            <select 
              className='filter-btn' 
              value={selectedGender} 
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <option value=''>All Genders</option>
              <option value='1'>Female</option>
              <option value='2'>Male</option>
            </select>
            <ChevronDown className='filter-icon' size={16} />
          </div>

          {/* Age Filter */}
          <div className='select-wrapper'>
            <select 
              className='filter-btn' 
              value={selectedAge} 
              onChange={(e) => setSelectedAge(e.target.value)}
            >
              <option value=''>All Ages</option>
              <option value='0-20'>0-20</option>
              <option value='21-30'>21-30</option>
              <option value='31-40'>31-40</option>
              <option value='41-50'>41-50</option>
              <option value='51-60'>51-60</option>
              <option value='60+'>60+</option>
            </select>
            <ChevronDown className='filter-icon' size={16} />
          </div>

          {/* Clear Filters Button */}
          {(selectedGender || selectedAge || searchQuery) && (
            <button onClick={clearFilters} className='clear-filters-btn'>
              Clear Filters
            </button>
          )}
        </div>

        {/* Actors List */}
        <section className='content-list'>
          <div className='content-grid'>
            {filterActors(actors).map((actor) => (
              <div key={actor.id} className='content-card' onClick={() => navigate(`/actors/${actor.id}`)}>
                <img 
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` : '/placeholder-actor.png'} 
                  alt={actor.name} 
                  className='content-img'
                />
                <div className='content-details'>
                  <p className='content-title'>{actor.name}</p>
                  {actor.birthday && <p className='content-subtitle'>Age: {calculateAge(actor.birthday)}</p>}
                </div>
              </div>
            ))}

            {/* Message for no matches */}
            {filterActors(actors).length === 0 && (
              <p className='no-results'>No actors match your filters.</p>
            )}
          </div>
        </section>

        {/* Load More Button */}
        {filterActors(actors).length > 0 && (
          <div className='load-more-container'>
            <button onClick={loadMoreActors} className='load-more-btn'>
              Load More
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default Actors