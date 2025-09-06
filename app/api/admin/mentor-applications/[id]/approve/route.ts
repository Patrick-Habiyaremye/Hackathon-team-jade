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

    if (!user || !user.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    // Find the application
    const application = await prisma.mentorApplication.findUnique({
      where: { id: params.id },
      include: {
        user: true
      }
    })

    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 })
    }

    if (application.status !== 'PENDING') {
      return NextResponse.json({ message: 'Application already processed' }, { status: 400 })
    }

    // Update application status
    await prisma.mentorApplication.update({
      where: { id: params.id },
      data: {
        status: 'APPROVED'
      }
    })

    // Update mentor profile to approved
    await prisma.mentorProfile.update({
      where: { userId: application.userId },
      data: {
        isApproved: true
      }
    })

    // Create notification for the mentor
    await prisma.notification.create({
      data: {
        userId: application.userId,
        title: 'Mentor Application Approved',
        message: 'Congratulations! Your mentor application has been approved. You can now receive mentorship requests.',
        type: 'MENTOR_APPROVED'
      }
    })

    return NextResponse.json({ message: 'Application approved successfully' })
  } catch (error) {
    console.error('Failed to approve mentor application:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}