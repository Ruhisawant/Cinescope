import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Star, Search, Drama, TrendingUp } from 'lucide-react'
import DashboardChart from '../components/Charts'
import './Dashboard.css'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY

const Dashboard = () => {
  const [popularMovies, setPopularMovies] = useState([])
  const [recentReleases, setRecentReleases] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [genres, setGenres] = useState({})
  const [topGenre, setTopGenre] = useState('Loading...')
  const [averageRating, setAverageRating] = useState(0)
  const [currentYearReleases, setCurrentYearReleases] = useState(0)
  const [averagePopularity, setAveragePopularity] = useState(0)
  const [allMovies, setAllMovies] = useState([])

  const navigate = useNavigate()

  // Fetch popular movies, recent releases, and genres
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popularResponse, recentResponse, genresResponse] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`),
          fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`),
          fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`)
        ])
        if (!popularResponse.ok || !recentResponse.ok || !genresResponse.ok) throw new Error('API request failed')

        const popularData = await popularResponse.json()
        const recentData = await recentResponse.json()
        const genresData = await genresResponse.json()

        // Genre Mapping
        const genreMap = {}
        genresData.genres.forEach(genre => {
          genreMap[genre.id] = genre.name
        })
        setGenres(genreMap)

        // Set Movie Lists
        const popular = popularData.results || []
        const recent = recentData.results || []
        setPopularMovies(popular)
        setRecentReleases(recent)

        const combined = [...popular, ...recent]
        setAllMovies(combined)

        // Calculate Average Rating
        const avg = popular.length > 0 
          ? popular.reduce((sum, movie) => sum + movie.vote_average, 0) / popular.length
          : 0
        setAverageRating(avg.toFixed(1))

        // Find Most Frequent Genre
        const allGenreIds = combined.flatMap(movie => movie.genre_ids)
        const genreCounts = {}
        allGenreIds.forEach(id => {
          genreCounts[id] = (genreCounts[id] || 0) + 1
        })

        if (Object.keys(genreCounts).length > 0) {
          const topGenreId = Object.keys(genreCounts).reduce((a, b) => 
            genreCounts[a] > genreCounts[b] ? a : b, Object.keys(genreCounts)[0])
          setTopGenre(genreMap[topGenreId] || 'Unknown')
        }

        // Count This Year’s Releases
        const currentYear = new Date().getFullYear()
        const thisYearReleases = combined.filter(movie => 
          movie.release_date && movie.release_date.startsWith(currentYear)
        ).length
        setCurrentYearReleases(thisYearReleases)

        // Calculate Average Popularity
        const totalPopularity = combined.reduce((sum, movie) => sum + movie.popularity, 0)
        const avgPopularity = combined.length > 0 
          ? (totalPopularity / combined.length).toFixed(0)
          : 0
        setAveragePopularity(avgPopularity)

      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchMovies()
  }, [])

  // Movie Search Filter
  const filterMovies = (movies) => {
    return movies.filter(movie => 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const filteredPopularMovies = filterMovies(popularMovies)
  const filteredRecentReleases = filterMovies(recentReleases)

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <h1>Dashboard</h1>
      </header>

      {/* Main Dashboard Content */}
      <main className='dashboard-content'>
        {/* Stats Summary Cards */}
        <section className='stats-summary'>
          <div className='stat-card'>
            <div className='stat-icon'><Star size={24} /></div>
            <div className='stat-info'>
              <h4>Average Rating</h4>
              <p className='stat-value'>{averageRating}</p>
            </div>
          </div>
          
          <div className='stat-card'>
            <div className='stat-icon'><Drama size={24} /></div>
            <div className='stat-info'>
              <h4>Top Genre</h4>
              <p className='stat-value'>{topGenre}</p>
            </div>
          </div>

          <div className='stat-card'>
            <div className='stat-icon'><Calendar size={24} /></div>
            <div className='stat-info'>
              <h4>This Year's Releases</h4>
              <p className='stat-value'>{currentYearReleases}</p>
            </div>
          </div>

          <div className='stat-card'>
            <div className='stat-icon'><TrendingUp size={24} /></div>
            <div className='stat-info'>
              <h4>Average Popularity Score</h4>
              <p className='stat-value'>{averagePopularity}</p>
            </div>
          </div>
        </section>

        {/* Popular Movies Section */}
        <section className='popular-movies'>
          <div className='section-header'>
            <h3 className='section-title'>Popular Movies</h3>
            <button className='view-all-btn' onClick={() => navigate('/movies')}>View All</button>
          </div>
          <div className='popular-list'>
            {filteredPopularMovies.slice(0, 12).map((movie) => (
              <div key={movie.id} className='popular-card' onClick={() => navigate(`/movies/${movie.id}`)}>
                <div className='card-content'>
                  <img 
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                    alt={movie.title}
                    className='popular-thumbnail'
                  />
                  <div className='popular-details'>
                    <p className='popular-title'>{movie.title}</p>
                    <div className='popular-rating'>
                      <Star size={14} className='star-icon' />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                    <div className='popular-release'>
                        <Calendar size={14} className='calendar-icon' />
                        {movie.release_date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Releases + Charts Section */}
        <section className='recent-grid'>
          <div className='recent-releases'>
            <div className='section-header'>
              <h3 className='section-title'>Recent Releases</h3>
              <button className='view-all-btn' onClick={() => navigate('/movies')}>View All</button>
            </div>
            <div className='releases-grid'>
              {filteredRecentReleases.slice(0, 6).map((movie) => (
                <div key={movie.id} className='release-card'>
                  <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className='movie-img' />
                  <div className='poster-overlay'>
                    <div>
                      <h4 className='release-title'>{movie.title}</h4>
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
                      <button className='details-btn' onClick={() => navigate(`/movies/${movie.id}`)}>Click to see more</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Charts */}
          <div className='charts-col'>
            <DashboardChart movies={allMovies} genreMap={genres} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard