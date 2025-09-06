'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface MentorRequest {
  id: string
  mentee: {
    firstName: string
    lastName: string
    email: string
  }
  message: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: string
}

export default function MentorDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<MentorRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    if (user.role !== 'MENTOR') {
      router.push('/')
      return
    }

    const fetchData = async () => {
      await fetchRequests()
    }

    fetchData()
  }, [user, router])

  const fetchRequests = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/mentor-requests', {
        headers: {
          Authorization: `Bearer ${token}`
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

  const handleRequestAction = async (requestId: string, action: 'accept' | 'reject') => {
    const responseMessage =
      action === 'accept'
        ? prompt('Add a response message (optional):')
        : prompt('Add a reason for rejection (optional):')

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const res = await fetch(`/api/mentor-requests/${requestId}/${action}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ response: responseMessage })
      })

      if (res.ok) {
        await fetchRequests() // Refresh the list
        alert(`Request ${action}ed successfully!`)
      } else {
        const error = await res.json()
        alert(error.message || `Failed to ${action} request`)
      }
    } catch (error) {
      console.error(`Failed to ${action} request:`, error)
      alert(`Failed to ${action} request`)
    }
  }

  if (!user || user.role !== 'MENTOR') {
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

  const pendingRequests = requests.filter((req) => req.status === 'PENDING')
  const acceptedRequests = requests.filter((req) => req.status === 'ACCEPTED')
  const rejectedRequests = requests.filter((req) => req.status === 'REJECTED')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  // Force clear auth state and go to home
                  localStorage.removeItem('token')
                  window.location.href = '/'
                }}
                className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Diaspora Bridge
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
                <p className="text-gray-600">Manage your mentorship requests</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => {
                  // Force clear auth state and go to home
                  localStorage.removeItem('token')
                  window.location.href = '/'
                }} 
                className="btn-secondary"
              >
                🏠 Home
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  window.location.href = '/'
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Requests</h3>
            <p className="text-3xl font-bold text-warning-600">{pendingRequests.length}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Accepted</h3>
            <p className="text-3xl font-bold text-success-600">{acceptedRequests.length}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rejected</h3>
            <p className="text-3xl font-bold text-danger-600">{rejectedRequests.length}</p>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Requests</h2>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.mentee.firstName} {request.mentee.lastName}
                      </h3>
                      <p className="text-gray-600">{request.mentee.email}</p>
                      <p className="text-sm text-gray-500">
                        Requested on {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-warning-100 text-warning-800 rounded-full text-sm font-medium">
                      PENDING
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Message:</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{request.message}</p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleRequestAction(request.id, 'accept')}
                      className="btn-success"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRequestAction(request.id, 'reject')}
                      className="btn-danger"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accepted Requests */}
        {acceptedRequests.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Accepted Requests</h2>
            <div className="space-y-4">
              {acceptedRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.mentee.firstName} {request.mentee.lastName}
                      </h3>
                      <p className="text-gray-600">{request.mentee.email}</p>
                      <p className="text-sm text-gray-500">
                        Accepted on {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-success-100 text-success-800 rounded-full text-sm font-medium">
                      ACCEPTED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejected Requests */}
        {rejectedRequests.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Rejected Requests</h2>
            <div className="space-y-4">
              {rejectedRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.mentee.firstName} {request.mentee.lastName}
                      </h3>
                      <p className="text-gray-600">{request.mentee.email}</p>
                      <p className="text-sm text-gray-500">
                        Rejected on {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-danger-100 text-danger-800 rounded-full text-sm font-medium">
                      REJECTED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {requests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No mentorship requests yet.</p>
            <p className="text-gray-400">Mentees will appear here when they request your guidance.</p>
          </div>
        )}
      </main>
    </div>
  )
}
