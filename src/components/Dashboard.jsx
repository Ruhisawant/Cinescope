import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Star, Search, Drama, TrendingUp } from 'lucide-react'
import './Dashboard.css'
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY
const POPULAR_MOVIES_API = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
const RECENT_RELEASES_API = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
const GENRES_API = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`

const Dashboard = () => {
  const [popularMovies, setPopularMovies] = useState([])
  const [recentReleases, setRecentReleases] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [genres, setGenres] = useState({})
  const [topGenre, setTopGenre] = useState('Loading...')
  const [averageRating, setAverageRating] = useState(0)
  const [currentYearReleases, setCurrentYearReleases] = useState(0)
  const [averagePopularity, setAveragePopularity] = useState(0)
  const [allMovies, setAllMovies] = useState([]);
  const [pieChartData, setPieChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popularResponse, recentResponse, genresResponse] = await Promise.all([
          fetch(POPULAR_MOVIES_API),
          fetch(RECENT_RELEASES_API),
          fetch(GENRES_API)
        ])

        if (!popularResponse.ok || !recentResponse.ok || !genresResponse.ok) 
          throw new Error('API request failed')

        const popularData = await popularResponse.json()
        const recentData = await recentResponse.json()
        const genresData = await genresResponse.json()

        // Create genre lookup map
        const genreMap = {}
        genresData.genres.forEach(genre => {
          genreMap[genre.id] = genre.name
        })
        setGenres(genreMap)

        // Set movies data
        const popular = popularData.results || []
        const recent = recentData.results || []
        setPopularMovies(popular)
        setRecentReleases(recent)

        //Combine movies for charts
        const combined = [...popular, ...recent];
        setAllMovies(combined);
        
        // Generate chart data
        generatePieChartData(combined, genreMap);
        generateLineChartData(combined);

        // Calculate average rating
        const avg = popular.length > 0 
          ? popular.reduce((sum, movie) => sum + movie.vote_average, 0) / popular.length
          : 0
        setAverageRating(avg.toFixed(1))

        // Find top genre
        const allGenreIds = [...popular, ...recent].flatMap(movie => movie.genre_ids)
        const genreCounts = {}
        allGenreIds.forEach(id => {
          genreCounts[id] = (genreCounts[id] || 0) + 1
        })
        
        if (Object.keys(genreCounts).length > 0) {
          const topGenreId = Object.keys(genreCounts).reduce((a, b) => 
            genreCounts[a] > genreCounts[b] ? a : b, Object.keys(genreCounts)[0])
          
          setTopGenre(genreMap[topGenreId] || 'Unknown')
        }

        // Count current year releases
        const allMovies = [...popular, ...recent]
        const currentYear = new Date().getFullYear()
        const thisYearReleases = allMovies.filter(movie => 
          movie.release_date && movie.release_date.startsWith(currentYear)
        ).length
        
        setCurrentYearReleases(thisYearReleases)
        
        // Calculate average popularity score
        const totalPopularity = allMovies.reduce((sum, movie) => sum + movie.popularity, 0)
        const avgPopularity = allMovies.length > 0 
          ? (totalPopularity / allMovies.length).toFixed(0)
          : 0
          
        setAveragePopularity(avgPopularity)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    
    fetchMovies()
  }, [])

  // Generate pie chart data with improved visualization
  const generatePieChartData = (movies, genreMap) => {
    // Count genres
    const genreCount = {};
    movies.forEach(movie => {
      if (movie.genre_ids && movie.genre_ids.length) {
        movie.genre_ids.forEach(genreId => {
          genreCount[genreId] = (genreCount[genreId] || 0) + 1;
        });
      }
    });
    
    // Sort genres by count (descending)
    const sortedGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1]);
    
    // Keep top 8 genres, group the rest as "Other"
    const MAX_SLICES = 8;
    let labels = [];
    let data = [];
    let otherCount = 0;
    
    sortedGenres.forEach(([genreId, count], index) => {
      if (index < MAX_SLICES) {
        labels.push(genreMap[genreId] || `Genre ${genreId}`);
        data.push(count);
      } else {
        otherCount += count;
      }
    });
    
    // Add "Other" category if needed
    if (otherCount > 0) {
      labels.push("Other");
      data.push(otherCount);
    }
    
    // Generate dynamic colors based on the number of slices
    const backgroundColor = [];
    const borderColor = [];
    
    for (let i = 0; i < labels.length; i++) {
      const hue = (i * 360) / labels.length;
      backgroundColor.push(`hsla(${hue}, 70%, 60%, 0.6)`);
      borderColor.push(`hsla(${hue}, 70%, 50%, 1)`);
    }
    
    setPieChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1,
        },
      ],
    });
  };

  // Generate improved line chart data
  const generateLineChartData = (movies) => {
    // Count movies by release year
    const yearsData = {};
    const ratingsByYear = {};
    const countByYear = {};
    
    // Extract and process the data
    movies.forEach(movie => {
      if (movie.release_date) {
        const year = new Date(movie.release_date).getFullYear();
        
        // Count movies by year
        yearsData[year] = (yearsData[year] || 0) + 1;
        
        // Track ratings by year for average calculation
        if (!ratingsByYear[year]) ratingsByYear[year] = 0;
        ratingsByYear[year] += movie.vote_average;
        
        if (!countByYear[year]) countByYear[year] = 0;
        countByYear[year]++;
      }
    });
    
    // Calculate average ratings by year
    const avgRatingsByYear = {};
    Object.keys(ratingsByYear).forEach(year => {
      avgRatingsByYear[year] = ratingsByYear[year] / countByYear[year];
    });
    
    // Sort years chronologically
    const sortedYears = Object.keys(yearsData).sort();
    
    // Prepare the data for the chart
    const moviesCountData = sortedYears.map(year => yearsData[year]);
    const avgRatingsData = sortedYears.map(year => avgRatingsByYear[year].toFixed(1));
    
    setLineChartData({
      labels: sortedYears,
      datasets: [
        {
          label: 'Number of Movies',
          data: moviesCountData,
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.4)',
          borderColor: 'rgba(75, 192, 192, 1)',
          yAxisID: 'y',
          tension: 0.1,
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Average Rating',
          data: avgRatingsData,
          fill: false,
          backgroundColor: 'rgba(255, 99, 132, 0.4)',
          borderColor: 'rgba(255, 99, 132, 1)',
          yAxisID: 'y1',
          tension: 0.1,
          borderDash: [5, 5],
          pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ],
    });
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw;
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      },
      title: {
        display: true,
        text: 'Movie Distribution by Genre',
        font: {
          size: 16
        }
      }
    },
    maintainAspectRatio: false
  };

  const lineChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'Movie Trends Over Time',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            return `Year: ${context[0].label}`;
          }
        }
      },
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Number of Movies'
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          precision: 0
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Average Rating'
        },
        min: 0,
        max: 10,
        grid: {
          drawOnChartArea: false,
        }
      },
      x: {
        title: {
          display: true,
          text: 'Release Year'
        }
      }
    },
    maintainAspectRatio: false
  };

  const filterMovies = (movies) => {
    return movies.filter(movie => 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const filteredPopularMovies = filterMovies(popularMovies)
  const filteredRecentReleases = filterMovies(recentReleases)

  return (
    <div className='dashboard-container'>
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

      <main className='dashboard-content'>
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

        <section className='popular-movies'>
          <div className='section-header'>
            <h3 className='section-title'>Popular Movies</h3>
            <button className='view-all-btn' onClick={() => navigate('/all-movies')}>View All</button>
          </div>
          <div className='popular-list'>
            {filteredPopularMovies.slice(0, 12).map((movie) => (
              <div key={movie.id} className='popular-card' onClick={() => navigate(`/movie-details/${movie.id}`)}>
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

        <section className='recent-grid'>
          <div className='recent-releases'>
            <div className='section-header'>
              <h3 className='section-title'>Recent Releases</h3>
              <button className='view-all-btn' onClick={() => navigate('/all-movies')}>View All</button>
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
                      <button className='details-btn' onClick={() => navigate(`/movie-details/${movie.id}`)}>Click to see more</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        
          <div className='charts-col'>
            <div className='chart-card'>
              <div className='chart-info'>
                {pieChartData ? (
                  <Pie data={pieChartData} options={pieChartOptions} />
                ) : (
                  <div className="loading">Loading chart data...</div>
                )}
              </div>
            </div>
            <div className='chart-card'>
              <div className='chart-info'>
                {lineChartData ? (
                  <Line data={lineChartData} options={lineChartOptions} />
                ) : (
                  <div className="loading">Loading chart data...</div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard;