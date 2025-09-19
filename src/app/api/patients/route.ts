import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    
    let patients
    if (search) {
      patients = await db.patient.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { medicalRecord: { contains: search, mode: 'insensitive' } }
          ]
        },
        include: {
          doctor: {
            select: { name: true, email: true }
          }
        }
      })
    } else {
      patients = await db.patient.findMany({
        include: {
          doctor: {
            select: { name: true, email: true }
          }
        }
      })
    }

    return NextResponse.json(patients)
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, dateOfBirth, medicalRecord, doctorId } = body

    if (!name || !doctorId) {
      return NextResponse.json(
        { error: 'Name and doctorId are required' },
        { status: 400 }
      )
    }

    // Verificar se o médico existe
    const doctor = await db.doctor.findUnique({
      where: { id: doctorId }
    })

    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 400 }
      )
    }

    // Verificar se email já existe (se fornecido)
    if (email) {
      const existingEmail = await db.patient.findFirst({
        where: { 
          email: email,
          id: { not: body.id } // Para permitir atualização com mesmo email
        }
      })

      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        )
      }
    }

    // Verificar se prontuário já existe (se fornecido)
    if (medicalRecord) {
      const existingMedicalRecord = await db.patient.findFirst({
        where: { 
          medicalRecord: medicalRecord,
          id: { not: body.id } // Para permitir atualização com mesmo prontuário
        }
      })

      if (existingMedicalRecord) {
        return NextResponse.json(
          { error: 'Medical record already registered' },
          { status: 400 }
        )
      }
    }

    const patient = await db.patient.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        medicalRecord: medicalRecord || null,
        doctorId
      },
      include: {
        doctor: {
          select: { name: true, email: true, crm: true, specialty: true }
        }
      }
    })

    return NextResponse.json(patient, { status: 201 })
  } catch (error) {
    console.error('Error creating patient:', error)
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    )
  }
}