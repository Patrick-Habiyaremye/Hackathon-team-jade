'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './contexts/AuthContext'
import Link from 'next/link'
import LoadingSpinner from './components/LoadingSpinner'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on role
      if (user.role === 'ADMIN') {
        router.push('/admin')
      } else if (user.role === 'MENTOR') {
        router.push('/mentor/dashboard')
      } else if (user.role === 'MENTEE') {
        router.push('/mentee/dashboard')
      }
    }
  }, [user, loading, router])

  // Show loading spinner immediately if loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-dark-900">
        <LoadingSpinner size="md" text="Loading..." />
      </div>
    )
  }


  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-dark-900">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-500">Diaspora Bridge</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Connecting Rwandan Youth with
            <span className="text-primary-500"> Diaspora Mentors</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Bridge the gap between Rwandan youth and successful diaspora professionals. 
            Find guidance, mentorship, and opportunities to grow your career.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?type=mentee" className="btn-primary text-lg px-8 py-3">
              I'm Looking for a Mentor
            </Link>
            <Link href="/register?type=mentor" className="btn-secondary text-lg px-8 py-3">
              I Want to Mentor
            </Link>
          </div>
        </div>

        {/* How it works / Mission anchors */}
        <section id="how-it-works" className="mt-16">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">How It Works</h2>
          <p className="text-center text-gray-300 max-w-3xl mx-auto">
            Sign up as a mentee to search approved mentors and request guidance. Sign up as a mentor to apply, get approved by admin, and receive mentee requests.
          </p>
        </section>

        <section id="mission" className="mt-12">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">Our Mission</h2>
          <p className="text-center text-gray-300 max-w-3xl mx-auto">
            Empower Rwandan youth by bridging them with global diaspora expertise, creating pathways to opportunities and growth.
          </p>
        </section>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-dark-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Your Mentor</h3>
            <p className="text-gray-300">
              Connect with experienced professionals from the diaspora who share your background and goals.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-dark-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Guidance</h3>
            <p className="text-gray-300">
              Receive personalized advice, career guidance, and support from mentors who understand your journey.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-dark-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
              <svg className="w-8 h-8 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Build Your Future</h3>
            <p className="text-gray-300">
              Access opportunities, build networks, and accelerate your professional growth with expert mentorship.
            </p>
          </div>
        </div>

        {/* For Mentors / For Mentees anchors */}
        <section id="for-mentees" className="mt-16">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">For Mentees</h2>
          <p className="text-center text-gray-300 max-w-3xl mx-auto">
            Create a profile, browse mentors by expertise and language, and send mentorship requests that mentors can accept or reject.
          </p>
        </section>

        <section id="for-mentors" className="mt-12">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">For Mentors</h2>
          <p className="text-center text-gray-300 max-w-3xl mx-auto">
            Apply with your expertise and availability. Once approved by the admin, you will appear in search and receive mentee requests in your dashboard.
          </p>
        </section>
      </main>
    </div>
  )
}
