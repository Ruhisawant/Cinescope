import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Star, Search, ChevronDown } from 'lucide-react'
import './AllContent.css'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY

const Movies = () => {
  const [movies, setMovies] = useState([])
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
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=`}${currentPage}`)
        if (!response.ok) throw new Error('Failed to fetch movies')

        const data = await response.json()
        setMovies((prevMovies) => {
          const existingIds = new Set(prevMovies.map(m => m.id))
          const newUniqueMovies = data.results.filter(movie => !existingIds.has(movie.id))
          return [...prevMovies, ...newUniqueMovies]
        })
      } catch (error) {
        setError('Error fetching movies: ', error.message)
      }
    }

    const fetchGenres = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`)
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

    fetchMovies(currentPage)
    fetchGenres()
    fetchLanguages()
  }, [currentPage])

  // Filter shows based on user inputs
  const filterMovies = (movies) => {
    return movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGenre = selectedGenre ? movie.genre_ids.includes(Number(selectedGenre)) : true
      const matchesRating = selectedRating ? movie.vote_average >= Number(selectedRating) : true
      const matchesYear = selectedYear ? movie.release_date.startsWith(selectedYear) : true
      const matchesLanguage = selectedLanguage ? movie.original_language === selectedLanguage : true
  
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
  const loadMoreMovies = () => {
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
            placeholder='Search movies...'
            className='search-input'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <h1>All Movies</h1>
      </header>

      {/* Main Movie Content */}
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

        {/* Movie List */}
        <section className='content-list'>
          <div className='content-grid'>
            {filterMovies(movies).map((movie) => (
              <div key={movie.id} className='content-card' onClick={() => navigate(`/movies/${movie.id}`)}>
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title} 
                  className='content-img'
                />
                <div className='content-details'>
                  <p className='content-title'>{movie.title}</p>
                  <div className='content-rating'>
                    <Star size={14} className='star-icon' />
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <p className='content-release'>
                    <Calendar size={16} /> {movie.release_date}
                  </p>
                </div>
              </div>
            ))}

            {/* Message for no matches */}
            {filterMovies(movies).length === 0 && (
              <p className='no-results'>No movies match your filters.</p>
            )}
          </div>
        </section>

        {/* Load More Button */}
        {filterMovies(movies).length > 0 && (
          <div className='load-more-container'>
            <button onClick={loadMoreMovies} className='load-more-btn'>
              Load More
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default Movies