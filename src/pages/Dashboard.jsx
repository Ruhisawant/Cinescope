import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Star, Search, Drama, TrendingUp } from 'lucide-react'
import DashboardChart from '../components/Charts'
import './Dashboard.css'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY

const Dashboard = () => {
  const [popularMovies, setPopularMovies] = useState([])
  const [popularTvShows, setPopularTvShows] = useState([])
  const [recentReleases, setRecentReleases] = useState([])
  const [popularPeople, setPopularPeople] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const [genres, setGenres] = useState({})
  const [topGenre, setTopGenre] = useState('Loading...')
  const [averageRating, setAverageRating] = useState(0)
  const [currentYearReleases, setCurrentYearReleases] = useState(0)
  const [contentStats, setContentStats] = useState({
    movies: 0,
    tvShows: 0,
    cast: 0,
    crew: 0
  })
  const [allContent, setAllContent] = useState({
    movies: [],
    tvShows: [],
    people: []
  })

  const navigate = useNavigate()

  // Fetch all content data
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [
          popularMoviesRes, 
          recentMoviesRes, 
          popularTvRes, 
          genresMovieRes, 
          genresTvRes,
          popularPeopleRes
        ] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`),
          fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`),
          fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`),
          fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=en-US&page=1`)
        ])

        if (!popularMoviesRes.ok || !recentMoviesRes.ok || !popularTvRes.ok || 
            !genresMovieRes.ok || !genresTvRes.ok || !popularPeopleRes.ok) 
          throw new Error('API request failed')

        const popularMoviesData = await popularMoviesRes.json()
        const recentMoviesData = await recentMoviesRes.json()
        const popularTvData = await popularTvRes.json()
        const genresMovieData = await genresMovieRes.json()
        const genresTvData = await genresTvRes.json()
        const popularPeopleData = await popularPeopleRes.json()

        // Genre Mapping (combine movie and TV genres)
        const genreMap = {}
        genresMovieData.genres.forEach(genre => {
          genreMap[genre.id] = genre.name
        })
        genresTvData.genres.forEach(genre => {
          genreMap[genre.id] = genre.name
        })
        setGenres(genreMap)

        // Set Content Lists
        const movies = popularMoviesData.results || []
        const recent = recentMoviesData.results || []
        const tvShows = popularTvData.results || []
        const people = popularPeopleData.results || []

        setPopularMovies(movies)
        setRecentReleases(recent)
        setPopularTvShows(tvShows)
        setPopularPeople(people)

        // Store all content
        setAllContent({
          movies: [...movies, ...recent],
          tvShows: tvShows,
          people: people
        })

        // Calculate Content Stats
        setContentStats({
          movies: movies.length + recent.length,
          tvShows: tvShows.length,
          cast: Math.floor(people.length * 0.7), // Approximation of cast vs crew
          crew: Math.floor(people.length * 0.3)  // Approximation of cast vs crew
        })

        // Calculate Average Rating (for movies and TV combined)
        const allRatings = [...movies, ...tvShows].map(item => item.vote_average)
        const avgRating = allRatings.length > 0 
          ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
          : 0
        setAverageRating(avgRating.toFixed(1))

        // Find Most Frequent Genre across all content
        const movieGenreIds = movies.flatMap(movie => movie.genre_ids)
        const tvGenreIds = tvShows.flatMap(show => show.genre_ids)
        const allGenreIds = [...movieGenreIds, ...tvGenreIds]
        
        const genreCounts = {}
        allGenreIds.forEach(id => {
          genreCounts[id] = (genreCounts[id] || 0) + 1
        })

        if (Object.keys(genreCounts).length > 0) {
          const topGenreId = Object.keys(genreCounts).reduce((a, b) => 
            genreCounts[a] > genreCounts[b] ? a : b, Object.keys(genreCounts)[0])
          setTopGenre(genreMap[topGenreId] || 'Unknown')
        }

        // Count This Year's Releases (movies and TV)
        const currentYear = new Date().getFullYear()
        const thisYearMovies = movies.filter(movie => 
          movie.release_date && movie.release_date.startsWith(currentYear)
        ).length
        const thisYearTv = tvShows.filter(show => 
          show.first_air_date && show.first_air_date.startsWith(currentYear)
        ).length
        setCurrentYearReleases(thisYearMovies + thisYearTv)

      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchContent()
  }, [])

  // Content Search Filter
  const filterContent = (contentList) => {
    return contentList.filter(item => {
      const title = item.title || item.name || ''
      return title.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }

  const filteredMovies = filterContent(popularMovies)
  const filteredTvShows = filterContent(popularTvShows)
  const filteredReleases = filterContent(recentReleases)
  const filteredPeople = filterContent(popularPeople)

  return (
    <div className='dashboard-container'>
      {/* Header */}
      <header className='header'>
        <div className='search-container'>
          <span className='search-icon'><Search size={18} /></span>
          <input 
            type='text'
            placeholder='Search for content...'
            className='search-input'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <h1>Dashboard</h1>
      </header>

      {/* Main Dashboard Content */}
      <main className='dashboard-content'>
        {/* Stats Cards */}
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
              <h4>Total Content</h4>
              <p className='stat-value'>{contentStats.movies + contentStats.tvShows}</p>
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
            {filteredMovies.slice(0, 8).map((movie) => (
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

        {/* Popular TV Shows Section */}
        <section className='popular-movies'>
          <div className='section-header'>
            <h3 className='section-title'>Popular TV Shows</h3>
            <button className='view-all-btn' onClick={() => navigate('/tv')}>View All</button>
          </div>
          <div className='popular-list'>
            {filteredTvShows.slice(0, 8).map((show) => (
              <div key={show.id} className='popular-card' onClick={() => navigate(`/tv/${show.id}`)}>
                <div className='card-content'>
                  <img 
                    src={`https://image.tmdb.org/t/p/w92${show.poster_path}`} 
                    alt={show.name}
                    className='popular-thumbnail'
                  />
                  <div className='popular-details'>
                    <p className='popular-title'>{show.name}</p>
                    <div className='popular-rating'>
                      <Star size={14} className='star-icon' />
                      <span>{show.vote_average.toFixed(1)}</span>
                    </div>
                    <div className='popular-release'>
                        <Calendar size={14} className='calendar-icon' />
                        {show.first_air_date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular People */}
        <section className='popular-movies'>
          <div className='section-header'>
            <h3 className='section-title'>Popular Cast & Crew</h3>
            <button className='view-all-btn' onClick={() => navigate('/people')}>View All</button>
          </div>
          <div className='popular-list'>
            {filteredPeople.slice(0, 8).map((person) => (
              <div key={person.id} className='popular-card' onClick={() => navigate(`/person/${person.id}`)}>
                <div className='card-content'>
                  <img 
                    src={`https://image.tmdb.org/t/p/w92${person.profile_path}`} 
                    alt={person.name}
                    className='popular-thumbnail'
                  />
                  <div className='popular-details'>
                    <p className='popular-title'>{person.name}</p>
                    <div className='popular-rating'>
                      <Star size={14} className='star-icon' />
                      <span>{person.popularity.toFixed(1)}</span>
                    </div>
                    <div className='popular-release'>
                      <span>Known for: {person.known_for_department || 'Acting'}</span>
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
              {filteredReleases.slice(0, 9).map((movie) => (
                <div key={movie.id} className='release-card'>
                  <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className='movie-img' />
                  <div className='poster-overlay'>
                    <div>
                      <h4 className='release-title'>{movie.title}</h4>
                      <div className='release-details'>
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
            <DashboardChart 
              movies={allContent.movies} 
              tvShows={allContent.tvShows}
              people={allContent.people}
              genreMap={genres} 
            />
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard