'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface Mentor {
  id: string
  user: {
    firstName: string
    lastName: string
    email: string
  }
  bio: string
  expertise: string[]
  languages: string[]
  availability: string
  experience: string
  education: string
  location: string
}

interface MentorshipRequest {
  id: string
  message: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: string
  mentor: {
    firstName: string
    lastName: string
    mentorProfile: {
      bio: string
      expertise: string
      location: string
    }
  }
}

export default function MenteeDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [requests, setRequests] = useState<MentorshipRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expertiseFilter, setExpertiseFilter] = useState('')
  const [activeTab, setActiveTab] = useState<'mentors' | 'requests'>('mentors')

  useEffect(() => {
    if (user && user.role !== 'MENTEE') {
      router.push('/')
      return
    }
    fetchMentors()
    fetchRequests()
  }, [user, router])

  const fetchMentors = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/mentors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMentors(data)
      }
    } catch (error) {
      console.error('Failed to fetch mentors:', error)
    }
  }

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/mentee/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const requestMentorship = async (mentorId: string) => {
    const message = prompt('Why would you like this mentor to guide you?')
    if (!message) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/mentor-requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mentorId,
          message
        })
      })

      if (response.ok) {
        alert('Mentorship request sent successfully!')
        fetchRequests() // Refresh requests list
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to send request')
      }
    } catch (error) {
      console.error('Failed to send request:', error)
      alert('Failed to send request')
    }
  }

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.bio.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesExpertise = !expertiseFilter || 
                            mentor.expertise.some(exp => 
                              exp.toLowerCase().includes(expertiseFilter.toLowerCase())
                            )
    
    return matchesSearch && matchesExpertise
  })

  if (!user || user.role !== 'MENTEE') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Your Mentor</h1>
              <p className="text-gray-600">Connect with experienced diaspora professionals</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/')}
                className="btn-secondary"
              >
                Home
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  router.push('/')
                }}
                className="btn-danger"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('mentors')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'mentors'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Find Mentors ({mentors.length})
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Requests ({requests.length})
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'mentors' && (
          <>
            {/* Search and Filters */}
            <div className="card mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    Search mentors
                  </label>
                  <input
                    type="text"
                    id="search"
                    className="input-field"
                    placeholder="Search by name or bio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by expertise
                  </label>
                  <input
                    type="text"
                    id="expertise"
                    className="input-field"
                    placeholder="e.g., Software Engineering, Business"
                    value={expertiseFilter}
                    onChange={(e) => setExpertiseFilter(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'requests' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Mentorship Requests</h2>
            <p className="text-gray-600 mb-6">
              Track the status of your mentorship requests. Mentors will respond to your requests.
            </p>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'mentors' && (
          <>
            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <div key={mentor.id} className="card">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {mentor.user.firstName[0]}{mentor.user.lastName[0]}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {mentor.user.firstName} {mentor.user.lastName}
                      </h3>
                      <p className="text-gray-600">{mentor.location}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">{mentor.bio}</p>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Expertise:</h4>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Languages:</h4>
                    <p className="text-gray-600">{mentor.languages.join(', ')}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Availability:</h4>
                    <p className="text-gray-600">{mentor.availability}</p>
                  </div>

                  <button
                    onClick={() => requestMentorship(mentor.id)}
                    className="w-full btn-primary"
                  >
                    Request Mentorship
                  </button>
                </div>
              ))}
            </div>

            {filteredMentors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No mentors found matching your criteria.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'requests' && (
          <>
            {/* Requests List */}
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.mentor.firstName} {request.mentor.lastName}
                        </h3>
                        <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === 'PENDING' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'ACCEPTED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{request.mentor.mentorProfile.location}</p>
                      <p className="text-gray-700 mb-3">{request.message}</p>
                      <p className="text-sm text-gray-500">
                        Sent on {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {requests.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">You haven't sent any mentorship requests yet.</p>
                <p className="text-gray-400 text-sm mt-2">Switch to the "Find Mentors" tab to start connecting!</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}


