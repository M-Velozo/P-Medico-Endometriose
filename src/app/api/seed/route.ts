import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Limpar dados existentes (opcional)
    await db.diagnosis.deleteMany()
    await db.patient.deleteMany()
    await db.doctor.deleteMany()

    // Criar médicos de exemplo
    const doctor1 = await db.doctor.create({
      data: {
        name: 'Dr. João Silva',
        email: 'joao.silva@exemplo.com',
        crm: '123456',
        specialty: 'Ginecologia e Obstetrícia',
        phone: '(11) 98765-4321'
      }
    })

    const doctor2 = await db.doctor.create({
      data: {
        name: 'Dra. Maria Santos',
        email: 'maria.santos@exemplo.com',
        crm: '789012',
        specialty: 'Reprodução Humana',
        phone: '(11) 91234-5678'
      }
    })

    const doctor3 = await db.doctor.create({
      data: {
        name: 'Dr. Pedro Oliveira',
        email: 'pedro.oliveira@exemplo.com',
        crm: '345678',
        specialty: 'Endocrinologia Ginecológica',
        phone: '(11) 92345-6789'
      }
    })

    // Criar pacientes de exemplo
    const patient1 = await db.patient.create({
      data: {
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '(11) 91234-5678',
        dateOfBirth: new Date('1990-05-15'),
        medicalRecord: 'MS001',
        doctorId: doctor1.id
      }
    })

    const patient2 = await db.patient.create({
      data: {
        name: 'Ana Oliveira',
        email: 'ana.oliveira@email.com',
        phone: '(11) 92345-6789',
        dateOfBirth: new Date('1985-08-22'),
        medicalRecord: 'AO002',
        doctorId: doctor2.id
      }
    })

    const patient3 = await db.patient.create({
      data: {
        name: 'Carla Pereira',
        email: 'carla.pereira@email.com',
        phone: '(11) 93456-7890',
        dateOfBirth: new Date('1992-12-10'),
        medicalRecord: 'CP003',
        doctorId: doctor1.id
      }
    })

    // Criar diagnósticos de exemplo
    await db.diagnosis.create({
      data: {
        patientId: patient1.id,
        doctorId: doctor1.id,
        peritoneum: 'P2',
        peritoneumSize: '3-7cm',
        ovary: 'O1',
        ovarySize: '<3cm',
        tube: 'T1',
        tubeSize: '<3cm',
        deepEndometriosis: 'B',
        deepEndometriosisSize: '3-7cm',
        observations: 'Paciente apresenta dor pélvica crônica. Lesões observadas durante laparoscopia.',
        finalClassification: 'P2O1T1B'
      }
    })

    await db.diagnosis.create({
      data: {
        patientId: patient2.id,
        doctorId: doctor2.id,
        peritoneum: 'P1',
        peritoneumSize: '<3cm',
        ovary: 'O2',
        ovarySize: '3-7cm',
        tube: 'T2',
        tubeSize: '3-7cm',
        deepEndometriosis: 'A',
        deepEndometriosisSize: '<3cm',
        observations: 'Endometriose moderada com envolvimento ovariano bilateral.',
        finalClassification: 'P1O2T2A'
      }
    })

    await db.diagnosis.create({
      data: {
        patientId: patient3.id,
        doctorId: doctor1.id,
        peritoneum: 'P3',
        peritoneumSize: '>7cm',
        ovary: 'O3',
        ovarySize: '>7cm',
        tube: 'T3',
        tubeSize: '>7cm',
        deepEndometriosis: 'C',
        deepEndometriosisSize: '>7cm',
        observations: 'Endometriose grave com acometimento extenso e infiltração de órgãos adjacentes.',
        finalClassification: 'P3O3T3C'
      }
    })

    return NextResponse.json({ 
      message: 'Dados de exemplo criados com sucesso',
      doctors: [doctor1, doctor2, doctor3],
      patients: [patient1, patient2, patient3]
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}