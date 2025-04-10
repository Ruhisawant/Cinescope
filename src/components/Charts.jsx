import { useEffect, useState } from 'react'
import { Line, Pie } from 'react-chartjs-2'
import './Charts.css'
import { 
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, 
  ArcElement, Title, Tooltip, Legend 
} from 'chart.js'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend
)

const DashboardChart = ({ movies, genreMap }) => {
  const [lineChartData, setLineChartData] = useState(null)
  const [pieChartData, setPieChartData] = useState(null)

  useEffect(() => {
    if (movies && movies.length) {
      generateLineChartData(movies);
      if (genreMap) {
        generatePieChartData(movies, genreMap);
      }
    }
  }, [movies, genreMap])

  // Pie Chart data
  const generatePieChartData = (movies, genreMap) => {
    const genreCount = {}
    movies.forEach(movie => {
      if (movie.genre_ids && movie.genre_ids.length) {
        movie.genre_ids.forEach(genreId => {
          genreCount[genreId] = (genreCount[genreId] || 0) + 1
        })
      }
    })

    const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1])

    const MAX_SLICES = 8
    let labels = []
    let data = []
    let otherCount = 0

    sortedGenres.forEach(([genreId, count], index) => {
      if (index < MAX_SLICES) {
        labels.push(genreMap[genreId] || `Genre ${genreId}`)
        data.push(count)
      } else {
        otherCount += count
      }
    })

    if (otherCount > 0) {
      labels.push('Other')
      data.push(otherCount)
    }

    const backgroundColor = []
    const borderColor = []

    for (let i = 0; i < labels.length; i++) {
      const hue = (i * 360) / labels.length
      backgroundColor.push(`hsla(${hue}, 70%, 60%, 0.6)`)
      borderColor.push(`hsla(${hue}, 70%, 50%, 1)`)
    }

    setPieChartData({
      labels,
      datasets: [{data, backgroundColor, borderColor, borderWidth: 1}],
    })
  }

  const pieChartOptions = {
    plugins: {
      legend: {
        position: 'right', 
        labels: {
          boxWidth: 15, 
          padding: 20, 
          color: '#fff',
          font: {
            size: 12
          }
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
        font: {size: 20, weight: 'bold'}, 
        color: '#fff',
        padding: {
          bottom: 20
        }
      },
    },
    maintainAspectRatio: false
  }

  // Line chart data
  const generateLineChartData = (movies) => {
    const yearsData = {}
    const ratingsByYear = {}
    const countByYear = {}

    movies.forEach(movie => {
      if (movie.release_date) {
        const year = new Date(movie.release_date).getFullYear()
        yearsData[year] = (yearsData[year] || 0) + 1
        if (!ratingsByYear[year]) ratingsByYear[year] = 0
        ratingsByYear[year] += movie.vote_average || 0
        countByYear[year] = (countByYear[year] || 0) + 1
      }
    })

    const avgRatingsByYear = {}
    Object.keys(ratingsByYear).forEach(year => {
      avgRatingsByYear[year] = ratingsByYear[year] / countByYear[year]
    })

    // Get all years from the earliest to the latest
    const allYears = Object.keys(yearsData).sort((a, b) => parseInt(a) - parseInt(b))
    const earliestYear = Math.min(...allYears.map(Number))
    const latestYear = Math.max(...allYears.map(Number))
    
    // Create a complete array of years, including those with no movies
    const completeYears = []
    for (let year = earliestYear; year <= latestYear; year++) {
      completeYears.push(year.toString())
    }

    // Prepare data sets with 0 for years without movies
    const moviesCountData = completeYears.map(year => yearsData[year] || 0)
    const avgRatingsData = completeYears.map(year => {
      if (avgRatingsByYear[year]) {
        return avgRatingsByYear[year].toFixed(1)
      }
      return null
    })

    setLineChartData({
      labels: completeYears,
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
          spanGaps: true,
        }
      ],
    })
  }

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
        font: {size: 20, weight: 'bold'}, 
        color: '#fff',
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          title: function(context) {return `Year: ${context[0].label}`}
        }
      },
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true, 
          text: 'Number of Movies', 
          color: '#fff',
          font: {
            size: 12
          }
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawOnChartArea: true
        },
        ticks: {
          precision: 0,
          color: '#fff'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true, 
          text: 'Average Rating', 
          color: '#fff',
          font: {
            size: 12
          }
        },
        min: 0,
        max: 10,
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          color: '#fff'
        }
      },
      x: {
        title: {
          display: true, 
          text: 'Release Year', 
          color: '#fff',
          font: {
            size: 12
          }
        },
        ticks: {
          color: '#fff',
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 20
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    maintainAspectRatio: false
  }

  return (
    <div className='charts-col'>
      <div className='chart-card'>
        {pieChartData ? (
          <Pie data={pieChartData} options={pieChartOptions} />
        ) : (
          <div className='loading'>Loading pie chart data...</div>
        )}
      </div>
      <div className='chart-card'>
        {lineChartData ? (
          <Line data={lineChartData} options={lineChartOptions} />
        ) : (
          <div className='loading'>Loading line chart data...</div>
        )}
      </div>
    </div>
  )
}

export default DashboardChart