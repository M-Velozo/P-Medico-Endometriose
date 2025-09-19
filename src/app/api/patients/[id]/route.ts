import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const patient = await db.patient.findUnique({
      where: { id },
      include: {
        doctor: {
          select: { name: true, email: true, crm: true, specialty: true }
        },
        diagnoses: {
          include: {
            doctor: {
              select: { name: true, email: true }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Error fetching patient:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, email, phone, dateOfBirth, medicalRecord, doctorId } = body

    if (!name || !doctorId) {
      return NextResponse.json(
        { error: 'Name and doctorId are required' },
        { status: 400 }
      )
    }

    // Verificar se o paciente existe
    const existingPatient = await db.patient.findUnique({
      where: { id }
    })

    if (!existingPatient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
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

    // Verificar se email já existe (se fornecido e diferente do atual)
    if (email && email !== existingPatient.email) {
      const existingEmail = await db.patient.findFirst({
        where: { 
          email: email,
          id: { not: id }
        }
      })

      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        )
      }
    }

    // Verificar se prontuário já existe (se fornecido e diferente do atual)
    if (medicalRecord && medicalRecord !== existingPatient.medicalRecord) {
      const existingMedicalRecord = await db.patient.findFirst({
        where: { 
          medicalRecord: medicalRecord,
          id: { not: id }
        }
      })

      if (existingMedicalRecord) {
        return NextResponse.json(
          { error: 'Medical record already registered' },
          { status: 400 }
        )
      }
    }

    const patient = await db.patient.update({
      where: { id },
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
        },
        diagnoses: {
          include: {
            doctor: {
              select: { name: true, email: true }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Error updating patient:', error)
    return NextResponse.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Verificar se o paciente existe
    const existingPatient = await db.patient.findUnique({
      where: { id }
    })

    if (!existingPatient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    // Deletar o paciente (os diagnósticos relacionados serão deletados em cascata)
    await db.patient.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Patient deleted successfully' })
  } catch (error) {
    console.error('Error deleting patient:', error)
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    )
  }
}