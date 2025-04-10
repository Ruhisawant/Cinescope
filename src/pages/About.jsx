import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Film, Users, Clapperboard, BarChart3, Info } from 'lucide-react'
import './About.css'

const About = () => {
  const navigate = useNavigate()
  
  // Feature Cards data
  const features = [
    {
      icon: <Film size={32} className='feature-icon' />,
      title: 'Movies & TV Shows',
      description: 'Explore the latest releases, popular titles, and comprehensive information on both movies and TV shows.'
    },
    {
      icon: <Users size={32} className='feature-icon' />,
      title: 'Cast & Crew Details',
      description: 'Discover actors, directors, and other industry professionals with detailed profile pages.'
    },
    {
      icon: <BarChart3 size={32} className='feature-icon' />,
      title: 'Visual Analytics',
      description: 'Gain insights through interactive charts and statistics about genres, ratings, and popularity trends.'
    },
    {
      icon: <Info size={32} className='feature-icon' />,
      title: 'Detailed Information',
      description: 'Access comprehensive details on every movie, TV show, and person in the entertainment industry.'
    },
  ]
  
  return (
    <div className='about-container'>
      {/* Header Section */}
      <header className='about-header'>
        <div className='logo-container'>
          <Clapperboard size={64} className='header-icon' />
        </div>
        <h1>Welcome to CineScope</h1>
        <p className='subtitle'>The complete entertainment guide powered by The Movie Database.</p>
      </header>

      {/* Introduction Section */}
      <section className='about-intro'>
        <div className='content-wrapper'>
          <p>
            CineScope is the ultimate entertainment destination, to bring you the latest and greatest from the world of 
            movies and television. Our sleek dashboard showcases trending titles and new releases, with each movie, 
            show, and personality featuring a dedicated page full of detailed information. <br />
            <br />
            Whether you're exploring new films, catching up on TV series, or discovering info about your favorite stars, 
            CineScope makes it easy to find exactly what you're looking for, all in one seamless experience.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className='about-features'>
        {features.map((feature, index) => (
          <div className='feature-card' key={index}>
            <div className='feature-icon-wrapper'>
              {feature.icon}
            </div>
            <h4>{feature.title}</h4>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Discover Section */}
      <section className='about-discover-more'>
        <p>Ready to discover your next favorite movie or TV show?</p>
        <button 
          className='explore-button' 
          onClick={() => navigate('/')}
        >
          Explore Dashboard
        </button>
      </section>
    </div>
  )
}

export default About