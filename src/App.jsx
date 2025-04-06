import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import Dashboard from './components/Dashboard.jsx'
import AllMovies from './components/AllMovies.jsx'


function App() {
  return (
    <Router>
      <Navigation>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/all-movies' element={<AllMovies />} />
          {/* <Route path='/trending' element={<Trending />} />
          <Route path='/about' element={<About />} /> */}
        </Routes>
      </Navigation>
    </Router>
  )
}

export default App