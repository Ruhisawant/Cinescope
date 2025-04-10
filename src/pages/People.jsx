import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown } from 'lucide-react'
import './AllContent.css'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY

const People = () => {
  const [people, setPeople] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedGender, setSelectedGender] = useState('')
  const [selectedAge, setSelectedAge] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  const navigate = useNavigate()

  // Fetch people
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=en-US&page=${currentPage}`)
        if (!response.ok) throw new Error('Failed to fetch people')
        
        const data = await response.json()
        const peopleWithDetails = await Promise.all(
          data.results.map(async (person) => {
            try {
              const detailResponse = await fetch(`https://api.themoviedb.org/3/person/${person.id}?api_key=${API_KEY}&language=en-US`)
              if (!detailResponse.ok) return person
              
              const detailData = await detailResponse.json()
              
              const creditsResponse = await fetch(`https://api.themoviedb.org/3/person/${person.id}/combined_credits?api_key=${API_KEY}&language=en-US`)
              const creditsData = creditsResponse.ok ? await creditsResponse.json() : { cast: [], crew: [] }
              
              const roles = []
              if (creditsData.cast && creditsData.cast.length > 0) roles.push('cast')
              if (creditsData.crew && creditsData.crew.length > 0) roles.push('crew')
              
              return {...person, ...detailData, roles}
            } catch (error) {
              console.error(`Error fetching details for person:`, error)
            }
          })
        )
        
        setPeople((prevPeople) => {
          const existingIds = new Set(prevPeople.map(p => p.id))
          const newUniquePeople = peopleWithDetails.filter(person => !existingIds.has(person.id))
          return [...prevPeople, ...newUniquePeople]
        })
      } catch (error) {
        console.error('Error fetching people:', error)
      }
    }

    fetchPeople()
  }, [currentPage])

  // Function to calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return null
    const birthYear = new Date(birthdate).getFullYear()
    const currentYear = new Date().getFullYear()
    return currentYear - birthYear
  }

  // Get role display text
  const getRoleDisplay = (person) => {
    if (!person.roles || person.roles.length === 0) return 'Unknown'
    
    if (person.roles.includes('cast') && person.roles.includes('crew')) return 'Cast, Crew'
    if (person.roles.includes('cast')) return 'Cast'
    if (person.roles.includes('crew')) return 'Crew'
  
    return 'Unknown'
  }

  // Filter people based on user inputs
  const filterPeople = (people) => {
    return people.filter(person => {
      const matchesSearch = searchQuery ? (person.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) : true
      const matchesGender = selectedGender ? person.gender === Number(selectedGender) : true
  
      // Role filter logic
      let matchesRole = true;
      if (selectedRole) {
        if (selectedRole === 'cast') {
          matchesRole = person.roles.includes('cast') && !person.roles.includes('crew')
        } else if (selectedRole === 'crew') {
          matchesRole = person.roles.includes('crew') && !person.roles.includes('cast')
        } else if (selectedRole === 'both') {
          matchesRole = person.roles.includes('cast') && person.roles.includes('crew')
        }
      }
  
      // Age filter logic
      let matchesAge = true;
      if (selectedAge) {
        const personAge = person.birthday ? calculateAge(person.birthday) : null
  
        if (personAge === null) {
          matchesAge = false
        } else if (selectedAge === '60+') {
          matchesAge = personAge >= 60
        } else {
          const [minAge, maxAge] = selectedAge.split('-').map(Number)
          matchesAge = personAge >= minAge && personAge <= maxAge
        }
      }
  
      return matchesSearch && matchesGender && matchesAge && matchesRole
    })
  }
  
  

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedGender('')
    setSelectedAge('')
    setSelectedRole('')
    document.querySelector('.search-input').value = ''
  }

  // Load more people
  const loadMorePeople = () => {
    setCurrentPage((prevPage) => prevPage + 1)
  }

  return (
    <>
      {/* Header */}
      <header className='header'>
        <div className='search-container'>
          <span className='search-icon'><Search size={18} /></span>
          <input 
            type='text'
            placeholder='Search people...'
            className='search-input'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <h1>All Cast & Crew</h1>
      </header>

      {/* Main Content */}
      <main className='content'>
        {/* Filters section */}
        <div className='filters-row'>
          {/* Gender Filter */}
          <div className='select-wrapper'>
            <select className='filter-btn' value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
              <option value=''>All Genders</option>
              <option value='1'>Female</option>
              <option value='2'>Male</option>
            </select>
            <ChevronDown className='filter-icon' size={16} />
          </div>

          {/* Age Filter */}
          <div className='select-wrapper'>
            <select className='filter-btn' value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)}>
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

          {/* Role Filter */}
          <div className='select-wrapper'>
            <select className='filter-btn' value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value=''>All Roles</option>
              <option value='cast'>Cast</option>
              <option value='crew'>Crew</option>
              <option value='both'>Both</option>
            </select>
            <ChevronDown className='filter-icon' size={16} />
          </div>

          {/* Clear Filters Button */}
          {(selectedGender || selectedAge || selectedRole || searchQuery) && (
            <button onClick={clearFilters} className='clear-filters-btn'>
              Clear Filters
            </button>
          )}
        </div>

        {/* People Cards Section */}
        <section className='content-list'>
          <div className='content-grid'>
            {filterPeople(people).map((person) => (
              <div key={person.id} className='content-card' onClick={() => navigate(`/people/${person.id}`)}>
                <img 
                  src={person.profile_path ? `https://image.tmdb.org/t/p/w300${person.profile_path}` : '/placeholder-person.png'} 
                  alt={person.name} 
                  className='content-img'
                />
                <div className='content-details'>
                  <p className='content-title'>{person.name}</p>
                  <p className='content-subtitle'>
                    {getRoleDisplay(person)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filterPeople(people).length === 0 && (
            <div className='no-results'>
              <p>No people match your filters.</p>
              <button onClick={clearFilters} className='clear-filters-btn'>
                Clear All Filters
              </button>
            </div>
          )}
        </section>

        {/* Load More Button */}
        {filterPeople(people).length > 0 && (
          <div className='load-more-container'>
            <button onClick={loadMorePeople} className='load-more-btn'>
              Load More
            </button>
          </div>
        )}
      </main>
    </>
  )
}

export default People