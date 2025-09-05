import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ message: 'Email and code are required' }, { status: 400 })
    }

    // Check if this is the correct admin email and code
    if (email !== 'ndamukundavainqueur@gmail.com' || code !== '1234@') {
      return NextResponse.json({ message: 'Invalid admin credentials' }, { status: 401 })
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { isAdmin: true }
    })

    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin already exists' }, { status: 400 })
    }

    // Check if user with this email already exists
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (user) {
      // Update existing user to admin
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          isAdmin: true,
          role: 'ADMIN',
          adminVerifiedAt: new Date()
        }
      })
    } else {
      // Create new admin user
      const hashedPassword = await hashPassword('admin123') // Default password
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
          isAdmin: true,
          adminVerifiedAt: new Date()
        }
      })
    }

    const token = generateToken(user.id)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Admin access granted',
      token,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Admin claim error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
