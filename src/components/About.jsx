import React from 'react'
import './About.css'
import { Film, Info, Star, Search, Clapperboard } from 'lucide-react'

const About = () => {
  return (
    <div className='about-container'>
      <header className='about-header'>
        <Clapperboard size={64} className='header-icon' />
        <h1>Welcome to CineScope</h1>
        <p>Discover, explore, and dive into the world of cinema with ease.</p>
      </header>

      <section className='about-intro'>
        <p>
          MovieVerse is your curated gateway to the vast universe of movies. We've designed a platform that brings you closer to the films you love, and introduces you to new favorites.
          From the latest blockbusters to timeless classics, our intuitive dashboard offers a seamless experience for every movie enthusiast.
        </p>
      </section>

      <section className='about-features'>
        <div className='feature-card'>
          <Film size={32} className='feature-icon' />
          <h4>Trending & New Releases</h4>
          <p>Get instant access to the most talked-about and recently launched movies.</p>
        </div>

        <div className='feature-card'>
          <Star size={32} className='feature-icon' />
          <h4>Detailed Movie Insights</h4>
          <p>Explore ratings, genres, and popularity metrics to make informed choices.</p>
        </div>

        <div className='feature-card'>
          <Search size={32} className='feature-icon' />
          <h4>Effortless Search & Navigation</h4>
          <p>Find your next movie with our clean, responsive, and user-friendly interface.</p>
        </div>

        <div className='feature-card'>
          <Info size={32} className='feature-icon' />
          <h4>Powered by TMDB API</h4>
          <p>Reliable and up-to-date movie information directly from The Movie Database.</p>
        </div>
      </section>

      <section className='about-call-to-action'>
        <p>Ready to start exploring? Dive into the world of movies now!</p>
        <button className='explore-button'>Explore Movies</button>
      </section>
    </div>
  )
}

export default About