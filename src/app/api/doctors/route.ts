import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    
    let doctors
    if (search) {
      doctors = await db.doctor.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { crm: { contains: search, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          name: true,
          email: true,
          crm: true,
          specialty: true,
          phone: true,
          createdAt: true
        }
      })
    } else {
      doctors = await db.doctor.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          crm: true,
          specialty: true,
          phone: true,
          createdAt: true
        }
      })
    }

    return NextResponse.json(doctors)
  } catch (error) {
    console.error('Error fetching doctors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, crm, specialty, phone } = body

    if (!name || !email || !crm || !specialty) {
      return NextResponse.json(
        { error: 'Name, email, CRM and specialty are required' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingEmail = await db.doctor.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Verificar se CRM já existe
    const existingCRM = await db.doctor.findUnique({
      where: { crm }
    })

    if (existingCRM) {
      return NextResponse.json(
        { error: 'CRM already registered' },
        { status: 400 }
      )
    }

    const doctor = await db.doctor.create({
      data: {
        name,
        email,
        crm,
        specialty,
        phone
      }
    })

    return NextResponse.json(doctor, { status: 201 })
  } catch (error) {
    console.error('Error creating doctor:', error)
    return NextResponse.json(
      { error: 'Failed to create doctor' },
      { status: 500 }
    )
  }
}