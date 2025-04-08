import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MovieDetails from './components/MovieDetails.jsx'
import AllMovies from './pages/AllMovies.jsx'
// import Trending from './components/Trending.jsx'
import About from './pages/About.jsx'

function App() {
  return (
    <Router>
      <Navigation>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/movie-details/:id' element={<MovieDetails />} />
          <Route path='/all-movies' element={<AllMovies />} />
          {/* <Route path='/trending' element={<Trending />} /> */}
          <Route path='/about' element={<About />} />
        </Routes>
      </Navigation>
    </Router>
  )
}

export default App