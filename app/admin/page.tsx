'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface MentorApplication {
  id: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  message: string
  createdAt: string
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [applications, setApplications] = useState<MentorApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push('/')
      return
    }
    fetchApplications()
  }, [user, router])

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/mentor-applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplicationAction = async (applicationId: string, action: 'approve' | 'reject') => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/mentor-applications/${applicationId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        await fetchApplications() // Refresh the list
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update application')
      }
    } catch (error) {
      console.error('Failed to update application:', error)
      alert('Failed to update application')
    }
  }

  if (!user || !user.isAdmin) {
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage mentor applications and platform settings</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="btn-secondary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Applications</h3>
            <p className="text-3xl font-bold text-warning-600">
              {applications.filter(app => app.status === 'PENDING').length}
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Approved Mentors</h3>
            <p className="text-3xl font-bold text-success-600">
              {applications.filter(app => app.status === 'APPROVED').length}
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rejected Applications</h3>
            <p className="text-3xl font-bold text-danger-600">
              {applications.filter(app => app.status === 'REJECTED').length}
            </p>
          </div>
        </div>

        {/* Applications List */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Mentor Applications</h2>
          
          {applications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No applications found</p>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.user.firstName} {application.user.lastName}
                      </h3>
                      <p className="text-gray-600">{application.user.email}</p>
                      <p className="text-sm text-gray-500">
                        Applied on {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      application.status === 'PENDING' ? 'bg-warning-100 text-warning-800' :
                      application.status === 'APPROVED' ? 'bg-success-100 text-success-800' :
                      'bg-danger-100 text-danger-800'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Application Message:</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {application.message}
                    </p>
                  </div>

                  {application.status === 'PENDING' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApplicationAction(application.id, 'approve')}
                        className="btn-success"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApplicationAction(application.id, 'reject')}
                        className="btn-danger"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


