import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { email, password, firstName, lastName, type, ...profileData } = data

    if (!email || !password || !firstName || !lastName || !type) {
      return NextResponse.json({ message: 'All required fields must be provided' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: type.toUpperCase() as 'MENTOR' | 'MENTEE'
      }
    })

    // Create profile based on type
    if (type === 'mentor') {
      await prisma.mentorProfile.create({
        data: {
          userId: user.id,
          bio: profileData.bio || '',
          expertise: Array.isArray(profileData.expertise) ? profileData.expertise.join(',') : (profileData.expertise || ''),
          languages: Array.isArray(profileData.languages) ? profileData.languages.join(',') : (profileData.languages || ''),
          availability: profileData.availability || '',
          experience: profileData.experience || '',
          education: profileData.education || '',
          location: profileData.location || '',
          isApproved: false
        }
      })

      // Create mentor application
      await prisma.mentorApplication.create({
        data: {
          userId: user.id,
          message: profileData.bio || 'I would like to become a mentor to help Rwandan youth.'
        }
      })
    } else if (type === 'mentee') {
      await prisma.menteeProfile.create({
        data: {
          userId: user.id,
          bio: profileData.bio || '',
          goals: Array.isArray(profileData.goals) ? profileData.goals.join(',') : (profileData.goals || ''),
          interests: Array.isArray(profileData.interests) ? profileData.interests.join(',') : (profileData.interests || ''),
          location: profileData.location || '',
          education: profileData.education || ''
        }
      })
    }

    const token = generateToken(user.id)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Registration successful',
      token,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}


