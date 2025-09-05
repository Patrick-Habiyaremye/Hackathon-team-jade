'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    type: 'mentee',
    bio: '',
    location: '',
    education: '',
    experience: '',
    expertise: '',
    goals: '',
    interests: '',
    languages: '',
    availability: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'mentor' || type === 'mentee') {
      setFormData(prev => ({ ...prev, type }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const result = await register({
      ...formData,
      expertise: formData.expertise ? formData.expertise.split(',').map(s => s.trim()) : [],
      goals: formData.goals ? formData.goals.split(',').map(s => s.trim()) : [],
      interests: formData.interests ? formData.interests.split(',').map(s => s.trim()) : [],
      languages: formData.languages ? formData.languages.split(',').map(s => s.trim()) : []
    })
    
    if (result.success) {
      router.push('/')
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-gray-600">
            Join the Diaspora Bridge community
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white shadow rounded-lg p-6">
            {/* Basic Information */}
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  className="input-field mt-1"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  required
                  className="input-field mt-1"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="input-field mt-1"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  className="input-field mt-1"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  className="input-field mt-1"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to:
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="mentee"
                    checked={formData.type === 'mentee'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <span>Find a mentor (I'm looking for guidance)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="mentor"
                    checked={formData.type === 'mentor'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <span>Become a mentor (I want to help others)</span>
                </label>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                name="bio"
                id="bio"
                rows={3}
                className="input-field mt-1"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            {/* Location and Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  className="input-field mt-1"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                  Education
                </label>
                <input
                  type="text"
                  name="education"
                  id="education"
                  className="input-field mt-1"
                  placeholder="Degree, Institution"
                  value={formData.education}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Mentor-specific fields */}
            {formData.type === 'mentor' && (
              <>
                <div className="mt-6">
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Professional Experience
                  </label>
                  <textarea
                    name="experience"
                    id="experience"
                    rows={3}
                    className="input-field mt-1"
                    placeholder="Describe your professional background..."
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
                    Areas of Expertise (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="expertise"
                    id="expertise"
                    className="input-field mt-1"
                    placeholder="e.g., Software Engineering, Business, Finance"
                    value={formData.expertise}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="languages" className="block text-sm font-medium text-gray-700">
                    Languages (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="languages"
                    id="languages"
                    className="input-field mt-1"
                    placeholder="e.g., English, Kinyarwanda, French"
                    value={formData.languages}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                    Availability
                  </label>
                  <input
                    type="text"
                    name="availability"
                    id="availability"
                    className="input-field mt-1"
                    placeholder="e.g., Weekends, Evenings, Flexible"
                    value={formData.availability}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {/* Mentee-specific fields */}
            {formData.type === 'mentee' && (
              <>
                <div className="mt-6">
                  <label htmlFor="goals" className="block text-sm font-medium text-gray-700">
                    Career Goals (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="goals"
                    id="goals"
                    className="input-field mt-1"
                    placeholder="e.g., Software Developer, Entrepreneur, Data Scientist"
                    value={formData.goals}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
                    Areas of Interest (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="interests"
                    id="interests"
                    className="input-field mt-1"
                    placeholder="e.g., Technology, Business, Healthcare"
                    value={formData.interests}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div className="flex justify-between">
            <Link href="/login" className="btn-secondary">
              Already have an account? Sign in
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
