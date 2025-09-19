import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    
    if (patientId) {
      const diagnoses = await db.diagnosis.findMany({
        where: { patientId },
        include: {
          patient: {
            select: { name: true, medicalRecord: true }
          },
          doctor: {
            select: { name: true, crm: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json(diagnoses)
    }

    const diagnoses = await db.diagnosis.findMany({
      include: {
        patient: {
          select: { name: true, medicalRecord: true }
        },
        doctor: {
          select: { name: true, crm: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(diagnoses)
  } catch (error) {
    console.error('Error fetching diagnoses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch diagnoses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      patientId,
      doctorId,
      peritoneum,
      peritoneumSize,
      ovary,
      ovarySize,
      tube,
      tubeSize,
      deepEndometriosis,
      deepEndometriosisSize,
      observations
    } = body

    // Validar campos obrigatórios
    if (!patientId || !doctorId || !peritoneum || !ovary || !tube || !deepEndometriosis) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calcular classificação final
    const finalClassification = `${peritoneum}${ovary}${tube}${deepEndometriosis}`

    const diagnosis = await db.diagnosis.create({
      data: {
        patientId,
        doctorId,
        peritoneum,
        peritoneumSize,
        ovary,
        ovarySize,
        tube,
        tubeSize,
        deepEndometriosis,
        deepEndometriosisSize,
        observations,
        finalClassification
      },
      include: {
        patient: {
          select: { name: true, medicalRecord: true }
        },
        doctor: {
          select: { name: true, crm: true }
        }
      }
    })

    return NextResponse.json(diagnosis, { status: 201 })
  } catch (error) {
    console.error('Error creating diagnosis:', error)
    return NextResponse.json(
      { error: 'Failed to create diagnosis' },
      { status: 500 }
    )
  }
}