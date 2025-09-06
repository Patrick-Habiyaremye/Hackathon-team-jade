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

    const notifications = await prisma.notification.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}


