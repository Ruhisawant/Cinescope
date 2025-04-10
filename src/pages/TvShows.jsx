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
        const response = await fetch(`https://api.themoviedb.org/3/trending/tv/week?page=${currentPage}&api_key=${API_KEY}`)
        if (!response.ok) throw new Error('Failed to fetch TV shows')
        
        const data = await response.json()
        setTvShows(prevShows => {
          const existingIds = new Set(prevShows.map(m => m.id))
          const newUniqueShows = data.results.filter(show => !existingIds.has(show.id))
          return [...prevShows, ...newUniqueShows]
        })
      } catch (error) {
        console.error('Error fetching TV shows:', error)
      }
    }

    const fetchInitialData = async () => {
      try {
        const [genresData, languagesData] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/genre/tv/list?language=en-US&api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/configuration/languages?api_key=${API_KEY}`)
        ])
        if (!genresData.ok || !languagesData.ok) throw new Error('Failed to fetch data')

        const genresDataJson = await genresData.json()
        const languagesDataJson = await languagesData.json()

        setGenres(genresDataJson.genres)
        setLanguages(languagesDataJson)
      } catch (error) {
        console.error('Error fetching initial data:', error)
      }
    }

    fetchTVShows()
    fetchInitialData()
  }, [currentPage])

  // Filter shows based on user inputs
  const filterShows = (shows) => {
    return shows.filter(show => {      
      const matchesSearch = show.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGenre = selectedGenre ? show.genre_ids?.includes(Number(selectedGenre)) : true
      const matchesRating = selectedRating ? show.vote_average >= Number(selectedRating) : true
      const matchesYear = selectedYear ? show.first_air_date?.startsWith(selectedYear) : true
      const matchesLanguage = selectedLanguage ? show.original_language === selectedLanguage : true

      return matchesSearch && matchesGenre && matchesRating && matchesYear && matchesLanguage
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedGenre('')
    setSelectedRating('')
    setSelectedYear('')
    setSelectedLanguage('')
    document.querySelector('.search-input').value = ''
  }

  // Load more shows
  const loadMoreShows = () => {
    setCurrentPage((prevPage) => prevPage + 1)
  }

  // Format show air date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <>
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

      {/* Main content */}
      <main className='content'>
        {/* Filters section */}
        <div className='filters-row'>
          {/* Genre Filter */}
          <div className='select-wrapper'>
            <select className='filter-btn' value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
              <option value=''>All Genres</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
            <ChevronDown className='filter-icon' size={16} />
          </div>

          {/* Rating Filter */}
          <div className='select-wrapper'>
            <select className='filter-btn' value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)}>
              <option value=''>All Ratings</option>
              <option value='9'>9+</option>
              <option value='8'>8+</option>
              <option value='7'>7+</option>
              <option value='6'>6+</option>
              <option value='5'>5+</option>
            </select>
            <ChevronDown className='filter-icon' size={16} />
          </div>

          {/* Year Filter */}
          <div className='select-wrapper'>
            <select className='filter-btn' value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value=''>All Years</option>
              {Array.from({ length: 20 }, (_, i) => {
                const year = new Date().getFullYear() - i
                return <option key={year} value={year}>{year}</option>
              })}
            </select>
            <ChevronDown className='filter-icon' size={16} />
          </div>

          {/* Language Filter */}
          <div className='select-wrapper'>
            <select className='filter-btn' value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
              <option value=''>All Languages</option>
              {languages.map(lang => (
                <option key={lang.iso_639_1} value={lang.iso_639_1}>
                  {lang.english_name}
                </option>
              ))}
            </select>
            <ChevronDown className='filter-icon' size={16} />
          </div>

          {/* Clear Filters button */}
          {(selectedGenre || selectedRating || selectedYear || selectedLanguage || searchQuery) && (
            <button onClick={clearFilters} className='clear-filters-btn'>
              Clear Filters
            </button>
          )}
        </div>
        
        {/* TV Show Cards Section */}
        <section className='content-list'>
          <div className='content-grid'>
            {filterShows(tvShows).map((show) => (
              <div key={show.id} className='content-card' onClick={() => navigate(`/tv-shows/${show.id}`)}>
                <img 
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} 
                  alt={`${show.name} poster`} 
                  className='content-img'
                />
                <div className='content-details'>
                  <p className='content-title'>{show.name}</p>
                  <div className='content-rating'>
                    <Star size={14} className='star-icon' />
                    <span>{show.vote_average?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <p className='content-release'>
                    <Calendar size={14} /> {formatDate(show.first_air_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filterShows(tvShows).length === 0 && (
            <div className='no-results'>
              <p>No shows match your filters.</p>
              <button onClick={clearFilters} className='clear-filters-btn'>
                Clear All Filters
              </button>
            </div>
          )}
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
    </>
  )
}

export default TVShows