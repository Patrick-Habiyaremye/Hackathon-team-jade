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

    if (!user || user.role !== 'MENTEE') {
      return NextResponse.json({ message: 'Mentee access required' }, { status: 403 })
    }

    const requests = await prisma.mentorRequest.findMany({
      where: {
        menteeId: user.id
      },
      include: {
        mentor: {
          include: {
            mentorProfile: {
              select: {
                bio: true,
                expertise: true,
                location: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Failed to fetch mentee requests:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
