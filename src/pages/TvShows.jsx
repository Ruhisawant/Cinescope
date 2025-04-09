import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Star, Search, ChevronDown } from 'lucide-react'
import './AllContent.css'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY

const TVShows = () => {
  const [tvShows, setTvShows] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [genres, setGenres] = useState([])
  const [languages, setLanguages] = useState([])
  
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedRating, setSelectedRating] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')

  const navigate = useNavigate()

  // Fetch TV shows, genres, and languages
  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}&page=${currentPage}`)
        if (!response.ok) throw new Error('Failed to fetch TV shows')

        const data = await response.json()
        setTvShows((prevShows) => {
          const existingIds = new Set(prevShows.map(m => m.id))
          const newUniqueShows = data.results.filter(show => !existingIds.has(show.id))
          return [...prevShows, ...newUniqueShows]
        })
      } catch (error) {
        console.error('Error fetching TV shows:', error.message)
      }
    }

    const fetchGenres = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`)
        if (!response.ok) throw new Error('Failed to fetch genres')

        const data = await response.json()
        setGenres(data.genres)
      } catch (error) {
        console.error('Error fetching genres:', error.message)
      }
    }

    const fetchLanguages = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/configuration/languages?api_key=${API_KEY}`)
        if (!response.ok) throw new Error('Failed to fetch languages')
  
        const data = await response.json()
        setLanguages(data)
      } catch (error) {
        console.error('Error fetching languages:', error.message)
      }
    }

    fetchTVShows(currentPage)
    fetchGenres()
    fetchLanguages()
  }, [currentPage])

  // Filter shows based on user inputs
  const filterShows = (tvShows) => {
    return tvShows.filter(show => {
      const matchesSearch = searchQuery ? (show.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) : true
      const matchesGenre = selectedGenre ? show.genre_ids.includes(Number(selectedGenre)) : true
      const matchesRating = selectedRating ? show.vote_average >= Number(selectedRating) : true
      const matchesYear = selectedYear ? show.first_air_date.startsWith(selectedYear) : true
      const matchesLanguage = selectedLanguage ? show.original_language === selectedLanguage : true
  
      return matchesSearch && matchesGenre && matchesRating && matchesYear && matchesLanguage
    })
  }

  // Reset all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedGenre('')
    setSelectedRating('')
    setSelectedYear('')
    setSelectedLanguage('')
    document.querySelector('.search-input').value = ''
  }

  // Load more shows by incrementing page number
  const loadMoreShows = () => {
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
            placeholder='Search shows...'
            className='search-input'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <h1>All TV Shows</h1>
      </header>

      {/* Main Show Content */}
      <main className='content'>
        <div className='filters-row'>
          {/* Genre Filter */}
          <div className='select-wrapper'>
            <select 
              className='filter-btn' 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value=''>All Genres</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
            <ChevronDown className='filter-icon' size={16} />
          </div>

          {/* Rating Filter */}
          <div className='select-wrapper'>
            <select 
              className='filter-btn' 
              value={selectedRating} 
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              <option value=''>All Ratings</option>
              <option value='9'>9+</option>
              <option value='8'>8+</option>
              <option value='7'>7+</option>
              <option value='6'>6+</option>
              <option value='5'>5+</option>
            </select>
            <ChevronDown className='filter-icon' size={16} />
          </div>

          {/* Release Year Filter */}
          <div className='select-wrapper'>
            <select 
              className='filter-btn' 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value=''>All Years</option>
              {Array.from({ length: 20 }, (_, i) => {
                const year = new Date().getFullYear() - i
                return <option key={year} value={year}>{year}</option>
              })}
            </select>
            <ChevronDown className='filter-icon' size={16} />
          </div>

          {/* Languages Filter */}
          <div className='select-wrapper'>
            <select 
              className='filter-btn' 
              value={selectedLanguage} 
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value=''>All Languages</option>
                {languages.map(lang => (
                  <option key={lang.iso_639_1} value={lang.iso_639_1}>
                    {lang.english_name}
                  </option>
                ))}
            </select>
            <ChevronDown className='filter-icon' size={16} />
          </div>

          {/* Clear Filters Button */}
          {(selectedGenre || selectedRating || selectedYear || selectedLanguage || searchQuery) && (
            <button onClick={clearFilters} className='clear-filters-btn'>
              Clear Filters
            </button>
          )}
        </div>
        
        {/* TV shows List */}
        <section className='content-list'>
          <div className='content-grid'>
            {filterShows(tvShows).map((show) => (
              <div key={show.id} className='content-card' onClick={() => navigate(`/tv-shows/${show.id}`)}>
                <img 
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} 
                  alt={show.name} 
                  className='content-img'
                />
                <div className='content-details'>
                  <p className='content-title'>{show.name}</p>
                  <div className='content-rating'>
                    <Star size={14} className='star-icon' />
                    <span>{show.vote_average.toFixed(1)}</span>
                  </div>
                  <p className='content-release'>
                    <Calendar size={16} /> {show.first_air_date}
                  </p>
                </div>
              </div>
            ))}

            {/* Message for no matches */}
            {filterShows(tvShows).length === 0 && (
              <p className='no-results'>No shows match your filters.</p>
            )}
          </div>
        </section>

        {/* Load More Button */}
        {filterShows(tvShows).length > 0 && (
          <div className='load-more-container'>
            <button onClick={loadMoreShows} className='load-more-btn'>
              Load More
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default TVShows