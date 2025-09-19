import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const doctor = await db.doctor.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        crm: true,
        specialty: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(doctor)
  } catch (error) {
    console.error('Error fetching doctor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch doctor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, email, crm, specialty, phone } = body

    // Verificar se o médico existe
    const existingDoctor = await db.doctor.findUnique({
      where: { id }
    })

    if (!existingDoctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      )
    }

    // Verificar se email já existe (se for diferente do atual)
    if (email && email !== existingDoctor.email) {
      const existingEmail = await db.doctor.findUnique({
        where: { email }
      })

      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        )
      }
    }

    // Verificar se CRM já existe (se for diferente do atual)
    if (crm && crm !== existingDoctor.crm) {
      const existingCRM = await db.doctor.findUnique({
        where: { crm }
      })

      if (existingCRM) {
        return NextResponse.json(
          { error: 'CRM already registered' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (crm !== undefined) updateData.crm = crm
    if (specialty !== undefined) updateData.specialty = specialty
    if (phone !== undefined) updateData.phone = phone

    const doctor = await db.doctor.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(doctor)
  } catch (error) {
    console.error('Error updating doctor:', error)
    return NextResponse.json(
      { error: 'Failed to update doctor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    // Verificar se o médico existe
    const existingDoctor = await db.doctor.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            patients: true,
            diagnoses: true
          }
        }
      }
    })

    if (!existingDoctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      )
    }

    // Verificar se o médico tem pacientes ou diagnósticos associados
    if (existingDoctor._count.patients > 0 || existingDoctor._count.diagnoses > 0) {
      return NextResponse.json(
        { error: 'Cannot delete doctor with associated patients or diagnoses' },
        { status: 400 }
      )
    }

    await db.doctor.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Doctor deleted successfully' })
  } catch (error) {
    console.error('Error deleting doctor:', error)
    return NextResponse.json(
      { error: 'Failed to delete doctor' },
      { status: 500 }
    )
  }
}