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

    const admin = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!admin || !admin.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    const application = await prisma.mentorApplication.findUnique({
      where: { id: params.id },
      include: { user: true }
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
      data: { status: 'REJECTED' }
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: application.userId,
        title: 'Mentor Application Rejected',
        message: 'Unfortunately, your mentor application was not approved at this time. You can reapply in the future.',
        type: 'MENTOR_REJECTED'
      }
    })

    return NextResponse.json({ message: 'Application rejected successfully' })
  } catch (error) {
    console.error('Failed to reject application:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
