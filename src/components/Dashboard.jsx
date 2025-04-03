import { useState, useEffect } from 'react'
import { Calendar, Star, Search, Popcorn, Drama } from 'lucide-react'
import './Dashboard.css'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY
const POPULAR_MOVIES_API = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
const RECENT_RELEASES_API = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
const GENRES_API = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`

const Dashboard = () => {
  const [popularMovies, setPopularMovies] = useState([])
  const [recentReleases, setRecentReleases] = useState([])
  const [genres, setGenres] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true)
      try {
        const [popularResponse, recentResponse, genresResponse] = await Promise.all([
          fetch(POPULAR_MOVIES_API),
          fetch(RECENT_RELEASES_API),
          fetch(GENRES_API)
        ])
        
        if (!popularResponse.ok || !recentResponse.ok || !genresResponse.ok) {throw new Error('API request failed')}
        
        const popularData = await popularResponse.json()
        const recentData = await recentResponse.json()
        const genresData = await genresResponse.json()

        setPopularMovies(popularData.results || [])
        setRecentReleases(recentData.results || [])
        setGenres(genresData.genres || [])
        setError(null)
      } catch (error) {
        setError('Error fetching movies: ' + error.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMovies()
  }, [])

  // Get genre names from genre IDs
  const getGenreNames = (genreIds) => {
    return genreIds
      .map(id => genres.find(genre => genre.id === id)?.name)
      .filter(Boolean)
      .slice(0, 2)
      .join(', ')
  }

  // Filter movies based on search query
  const filteredPopularMovies = popularMovies.filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredRecentReleases = recentReleases.filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className='dashboard-container'>
      {/* Header */}
      <header className='header'>
        <div className='search-container'>
          <span className='search-icon'><Search size={18} /></span>
          <input 
            type='text'
            placeholder='Search movies...'
            className='search-input'
            name='searchMovies'
            id='searchMovies'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <h1>Dashboard</h1>
      </header>

      <main className='dashboard-content'>
        {isLoading ? (
          <div className='loading-state'>
            <div className='loading-spinner'></div>
            <p>Loading movies...</p>
          </div>
        ) : error ? (
          <div className='error-state'>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className='retry-button'>Retry</button>
          </div>
        ) : (
          <>
            {/* Stats summary */}
            <section className='stats-summary'>
              <div className='stat-card'>
                <div className='stat-icon'><Popcorn size={24} /></div>
                <div className='stat-info'>
                  <h4>Total Popular</h4>
                  <p className='stat-value'>{popularMovies.length}</p>
                </div>
              </div>
              <div className='stat-card'>
                <div className='stat-icon'><Calendar size={24} /></div>
                <div className='stat-info'>
                  <h4>Recent Releases</h4>
                  <p className='stat-value'>{recentReleases.length}</p>
                </div>
              </div>
              <div className='stat-card'>
                <div className='stat-icon'><Star size={24} /></div>
                <div className='stat-info'>
                  <h4>Average Rating</h4>
                  <p className='stat-value'>
                    {(popularMovies.reduce((sum, movie) => sum + movie.vote_average, 0) / 
                      (popularMovies.length || 1)).toFixed(1)}
                  </p>
                </div>
              </div>
              <div className='stat-card'>
                <div className='stat-icon'><Drama size={24} /></div>
                <div className='stat-info'>
                  <h4>Top Genre</h4>
                  <p className='stat-value'>
                    {genres.length > 0 ? genres[0].name : 'Loading...'}
                  </p>
                </div>
              </div>
            </section>

            {/* Popular movies */}
            <section className='popular-movies'>
              <div className='section-header'>
                <h3 className='section-title'>Popular Movies</h3>
                <button className='view-all-btn'>View All</button>
              </div>
              <div className='popular-list'>
                {filteredPopularMovies.slice(0, 12).map((movie) => (
                  <div key={movie.id} className='popular-card'>
                    <div className='card-content'>
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                        alt={movie.title}
                        className='popular-thumbnail'
                      />
                      <div className='popular-details'>
                        <p className='popular-title'>{movie.title}</p>
                        <p className='popular-genre'>{getGenreNames(movie.genre_ids)}</p>
                        <div className='popular-rating'>
                          <Star size={14} className='star-icon' />
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent releases */}
            <section className='recent-releases'>
              <div className='section-header'>
                <h3 className='section-title'>Recent Releases</h3>
                <button className='view-all-btn'>View All</button>
              </div>
              <div className='releases-grid'>
                {filteredRecentReleases.slice(0, 15).map((movie) => (
                  <div key={movie.id} className='release-card'>
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className='movie-img' />
                    <div className='poster-overlay'>
                      <div>
                        <h4 className='release-title'>{movie.title}</h4>
                        <p className='release-overview'>{movie.overview.slice(0, 100)}...</p>
                        <div className='release-details'>
                          <div className='release-subtitle'>
                            <Calendar size={16} />
                            {movie.release_date}
                          </div>
                          <div className='release-subtitle'>
                            <Star size={16} />
                            {movie.vote_average.toFixed(1)}
                          </div>
                        </div>
                        <button className='watch-trailer-btn'>Watch Trailer</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard;