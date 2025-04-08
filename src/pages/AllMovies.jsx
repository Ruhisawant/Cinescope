import { useState, useEffect } from 'react'
import { Calendar, Star, Search, ChevronDown } from 'lucide-react'
import './AllMovies.css'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY
const ALL_MOVIES_API = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=`

const AllMovies = () => {
  const [movies, setMovies] = useState([])
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedGenre, setSelectedGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [selectedRating, setSelectedRating] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  // Fetch genres for the genre filter dropdown
  useEffect(() => {
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

    fetchGenres()
  }, [])

  // Fetch movie data when current page changes
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${ALL_MOVIES_API}${currentPage}`)
        if (!response.ok) throw new Error('API request failed')

        const data = await response.json()
        setMovies((prevMovies) => {
          const existingIds = new Set(prevMovies.map(m => m.id))
          const newUniqueMovies = data.results.filter(movie => !existingIds.has(movie.id))
          return [...prevMovies, ...newUniqueMovies]
        })

        setError(null)
      } catch (error) {
        setError('Error fetching movies: ' + error.message)
      }
    }

    fetchMovies()
  }, [currentPage])

  // Filters movies based on search query, genre, rating, and release year
  const filterMovies = (movies) => {
    return movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGenre = selectedGenre ? movie.genre_ids.includes(Number(selectedGenre)) : true
      const matchesRating = selectedRating ? movie.vote_average >= Number(selectedRating) : true
      const matchesYear = selectedYear ? movie.release_date.startsWith(selectedYear) : true

      return matchesSearch && matchesGenre && matchesRating && matchesYear
    })
  }

  const filteredMovies = filterMovies(movies)

  const loadMoreMovies = () => {
    setCurrentPage((prevPage) => prevPage + 1)
  }

  return (
    <div className='all-movies-container'>
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
      <main className='movies-content'>
        {/* Filters */}
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
        </div>

        {/* Error Handling */}
        {error ? (
          <div className='error-state'>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className='retry-button'>Retry</button>
          </div>
        ) : (
          <>
            {/* Movie List */}
            <section className='movies-list'>
              <div className='movies-grid'>
                {filteredMovies.map((movie) => (
                  <div key={movie.id} className='movie-card'>
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                      alt={movie.title} 
                      className='movie-img'
                    />
                    <div className='movie-details'>
                      <p className='movie-title'>{movie.title}</p>
                      <div className='movie-rating'>
                        <Star size={14} className='star-icon' />
                        <span>{movie.vote_average.toFixed(1)}</span>
                      </div>
                      <p className='movie-release'>
                        <Calendar size={16} /> {movie.release_date}
                      </p>
                    </div>
                  </div>
                ))}

                {/* No Matching Movies */}
                {filteredMovies.length === 0 && (
                  <p className='no-results'>No movies match your filters.</p>
                )}
              </div>
            </section>

            {/* Load More Button */}
            {filteredMovies.length > 0 && (
              <div className='load-more-container'>
                <button onClick={loadMoreMovies} className='load-more-btn'>
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default AllMovies