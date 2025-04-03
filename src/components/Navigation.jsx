import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Film, LineChart, Menu, Home, Clapperboard, Info } from 'lucide-react'
import './Navigation.css'

const Navigation = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const location = useLocation()

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {window.removeEventListener("resize", handleResize)}
  }, [])

  const isActive = (path) => {return location.pathname === path ? 'nav-active' : ''}

  return (
    <div className='app-container'>
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className='sidebar-header'>
          {sidebarOpen && (
            <div className='logo'>
              <Clapperboard size={24} className='logo-icon' />
              <h2 className='logo-text'>CineScope</h2>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className='menu-toggle'>
            <Menu size={20} />
          </button>
        </div>
        
        <nav className='sidebar-nav'>
          <div className='nav-section'>
            <h3 className={`section-title ${!sidebarOpen ? 'hidden' : ''}`}>Menu</h3>
            <ul className='nav-list'>
              <li>
                <Link to='/' className={`nav-item ${isActive('/')}`}>
                  <Home size={20} className='nav-icon' />
                  {sidebarOpen && <span className='nav-label'>Dashboard</span>}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className='nav-section'>
            <h3 className={`section-title ${!sidebarOpen ? 'hidden' : ''}`}>Library</h3>
            <ul className='nav-list'>
              <li>
                <Link to='/all-movies' className={`nav-item ${isActive('/all-movies')}`}>
                  <Film size={20} className='nav-icon' />
                  {sidebarOpen && <span className='nav-label'>All Movies</span>}
                </Link>
              </li>
              <li>
                <Link to='/trending' className={`nav-item ${isActive('/trending')}`}>
                  <LineChart size={20} className='nav-icon' />
                  {sidebarOpen && <span className='nav-label'>Trending</span>}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className='nav-section bottom-section'>
            <ul className='nav-list'>
              <li>
                <Link to='/about' className={`nav-item ${isActive('/about')}`}>
                  <Info size={20} className='nav-icon' />
                  {sidebarOpen && <span className='nav-label'>About</span>}
                </Link>
              </li>
              <li>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      
      <div className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
        {children}
      </div>
    </div>
  )
}

export default Navigation