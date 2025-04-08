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
      legend: {position: 'right', labels: {boxWidth: 15, padding: 20, color: '#fff'}},
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
      title: {display: true, text: 'Movie Distribution by Genre', font: {size: 25}, color: '#fff'},
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
        ratingsByYear[year] += movie.vote_average
        countByYear[year] = (countByYear[year] || 0) + 1
      }
    })

    const avgRatingsByYear = {}
    Object.keys(ratingsByYear).forEach(year => {
      avgRatingsByYear[year] = ratingsByYear[year] / countByYear[year]
    })

    const sortedYears = Object.keys(yearsData).sort()
    const moviesCountData = sortedYears.map(year => yearsData[year])
    const avgRatingsData = sortedYears.map(year => avgRatingsByYear[year].toFixed(1))

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
    })
  }

  const lineChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {display: true, text: 'Movie Trends Over Time', font: {size: 25}, color: '#fff'},
      tooltip: {
        callbacks: {
          title: function(context) {return `Year: ${context[0].label}`}
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
        title: {display: true, text: 'Number of Movies', color: '#fff'},
        beginAtZero: true,
        grid: {drawOnChartArea: false},
        ticks: {precision: 0}
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {display: true, text: 'Average Rating', color: '#fff'},
        min: 0,
        max: 10,
        grid: {drawOnChartArea: false}
      },
      x: {
        title: {display: true, text: 'Release Year', color: '#fff'}
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