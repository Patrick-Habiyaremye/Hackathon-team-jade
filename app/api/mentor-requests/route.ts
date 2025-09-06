import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    let requests

    if (user.role === 'MENTOR') {
      // Get requests sent to this mentor
      requests = await prisma.mentorRequest.findMany({
        where: { mentorId: user.id },
        include: {
          mentee: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else if (user.role === 'MENTEE') {
      // Get requests sent by this mentee
      requests = await prisma.mentorRequest.findMany({
        where: { menteeId: user.id },
        include: {
          mentor: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 })
    }

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Failed to fetch mentor requests:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const { mentorId, message } = await request.json()

    if (!mentorId || !message) {
      return NextResponse.json({ message: 'Mentor ID and message are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.role !== 'MENTEE') {
      return NextResponse.json({ message: 'Only mentees can send requests' }, { status: 403 })
    }

    // Check if mentor exists and is approved
    const mentor = await prisma.mentorProfile.findFirst({
      where: {
        userId: mentorId,
        isApproved: true
      }
    })

    if (!mentor) {
      return NextResponse.json({ message: 'Mentor not found or not approved' }, { status: 404 })
    }

    // Check if request already exists
    const existingRequest = await prisma.mentorRequest.findFirst({
      where: {
        menteeId: user.id,
        mentorId: mentorId
      }
    })

    if (existingRequest) {
      return NextResponse.json({ message: 'Request already sent to this mentor' }, { status: 400 })
    }

    // Create the request
    const mentorRequest = await prisma.mentorRequest.create({
      data: {
        menteeId: user.id,
        mentorId: mentorId,
        message
      }
    })

    // Create notification for mentor
    await prisma.notification.create({
      data: {
        userId: mentorId,
        title: 'New Mentorship Request',
        message: `${user.firstName} ${user.lastName} has requested your mentorship.`,
        type: 'MENTOR_REQUEST'
      }
    })

    return NextResponse.json({ message: 'Request sent successfully', request: mentorRequest })
  } catch (error) {
    console.error('Failed to create mentor request:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}


