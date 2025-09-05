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

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.role !== 'MENTOR') {
      return NextResponse.json({ message: 'Only mentors can accept requests' }, { status: 403 })
    }

    const { response } = await request.json()

    const mentorRequest = await prisma.mentorRequest.findUnique({
      where: { id: params.id },
      include: { mentee: true }
    })

    if (!mentorRequest) {
      return NextResponse.json({ message: 'Request not found' }, { status: 404 })
    }

    if (mentorRequest.mentorId !== user.id) {
      return NextResponse.json({ message: 'You can only accept your own requests' }, { status: 403 })
    }

    if (mentorRequest.status !== 'PENDING') {
      return NextResponse.json({ message: 'Request already processed' }, { status: 400 })
    }

    // Update request status
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
        message: `${user.firstName} ${user.lastName} has accepted your mentorship request.`,
        type: 'MENTOR_REQUEST_ACCEPTED'
      }
    })

    return NextResponse.json({ message: 'Request accepted successfully' })
  } catch (error) {
    console.error('Failed to accept request:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
