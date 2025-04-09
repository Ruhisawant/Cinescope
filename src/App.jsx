import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import MovieDetails from './components/MovieDetails.jsx'
import ShowDetails from './components/ShowDetails.jsx'
import ActorDetails from './components/ActorDetails'

import Dashboard from './pages/Dashboard.jsx'
import Movies from './pages/Movies.jsx'
import TVShows from './pages/TvShows.jsx'
import Actors from './pages/Actors.jsx'
import About from './pages/About.jsx'

function App() {
  return (
    <Router>
      <Navigation>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          
          <Route path='/movies' element={<Movies />} />
          <Route path='/movies/:id' element={<MovieDetails />} />
          
          <Route path='/tv-shows' element={<TVShows />} />
          <Route path='/tv-shows/:id' element={<ShowDetails />} />
          
          <Route path='/actors' element={<Actors />} />
          <Route path='/actors/:id' element={<ActorDetails />} />
          
          <Route path='/about' element={<About />} />
        </Routes>
      </Navigation>
    </Router>
  )
}

export default App