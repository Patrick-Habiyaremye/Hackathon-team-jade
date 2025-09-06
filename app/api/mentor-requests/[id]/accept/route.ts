import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { response } = await request.json()

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.role !== 'MENTOR') {
      return NextResponse.json({ message: 'Only mentors can accept requests' }, { status: 403 })
    }

    // Find the request and verify it belongs to this mentor
    const mentorRequest = await prisma.mentorRequest.findFirst({
      where: {
        id: params.id,
        mentorId: user.id,
        status: 'PENDING'
      },
      include: {
        mentee: true
      }
    })

    if (!mentorRequest) {
      return NextResponse.json({ message: 'Request not found or already processed' }, { status: 404 })
    }

    // Update the request status
    await prisma.mentorRequest.update({
      where: { id: params.id },
      data: {
        status: 'ACCEPTED',
        response: response || 'Request accepted'
      }
    })

    // Create notification for mentee
    await prisma.notification.create({
      data: {
        userId: mentorRequest.menteeId,
        title: 'Mentorship Request Accepted',
        message: `Your mentorship request has been accepted by ${user.firstName} ${user.lastName}.`,
        type: 'REQUEST_ACCEPTED'
      }
    })

    return NextResponse.json({ message: 'Request accepted successfully' })
  } catch (error) {
    console.error('Failed to accept mentor request:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}