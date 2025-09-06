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

    // Update notification as read
    await prisma.notification.updateMany({
      where: {
        id: params.id,
        userId: decoded.userId
      },
      data: {
        isRead: true
      }
    })

    return NextResponse.json({ message: 'Notification marked as read' })
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}