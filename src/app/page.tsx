'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { PatientForm } from '@/components/patient-form'
import { DiagnosisResults } from '@/components/diagnosis-results'
import { PatientHistory } from '@/components/patient-history'
import { ReferenceSection } from '@/components/reference-section'
import { DoctorManagement } from '@/components/doctor-management'

interface Patient {
  id: string
  name: string
  email?: string
  phone?: string
  dateOfBirth?: string
  medicalRecord?: string
  doctor?: {
    name: string
    email: string
  }
}

interface Doctor {
  id: string
  name: string
  email: string
  crm: string
  specialty: string
  phone?: string
}

export default function Home() {
  const [selectedPatient, setSelectedPatient] = useState<string>('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [classification, setClassification] = useState({
    peritoneum: '',
    peritoneumSize: '',
    ovary: '',
    ovarySize: '',
    tube: '',
    tubeSize: '',
    deepEndometriosis: '',
    deepEndometriosisSize: '',
    observations: ''
  })

  useEffect(() => {
    fetchPatients()
    fetchDoctors()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients')
      if (response.ok) {
        const data = await response.json()
        setPatients(data)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors')
      if (response.ok) {
        const data = await response.json()
        setDoctors(data)
        if (data.length > 0) {
          setSelectedDoctor(data[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching doctors:', error)
    }
  }

  const handleClassificationChange = (field: string, value: string) => {
    setClassification(prev => ({ ...prev, [field]: value }))
  }

  const calculateFinalClassification = () => {
    // Lógica para calcular a classificação final baseada nas seleções
    const { peritoneum, ovary, tube, deepEndometriosis } = classification
    return `${peritoneum}${ovary}${tube}${deepEndometriosis}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema de Classificação de Endometriose
          </h1>
          <p className="text-lg text-gray-600">
            Classificação de Keckstein para diagnóstico padronizado
          </p>
        </header>

        {/* Seletor de Paciente e Médico */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações da Consulta</CardTitle>
            <CardDescription>
              Selecione o paciente e o médico responsável
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient-select">Paciente</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} {patient.medicalRecord && `(${patient.medicalRecord})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="doctor-select">Médico Responsável</Label>
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o médico" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty} (CRM: {doctor.crm})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="classification" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="classification">Classificação</TabsTrigger>
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
            <TabsTrigger value="doctors">Médicos</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="reference">Referência</TabsTrigger>
          </TabsList>

          <TabsContent value="classification" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PERITÔNIO - Amarelo */}
              <Card className="border-2 border-yellow-400 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-800 flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                    PERITÔNIO
                  </CardTitle>
                  <CardDescription className="text-yellow-700">
                    Classificação das lesões peritoneais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-yellow-800">Classificação</Label>
                    <Select onValueChange={(value) => handleClassificationChange('peritoneum', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione P1, P2 ou P3" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P1">P1 - Lesões superficiais isoladas</SelectItem>
                        <SelectItem value="P2">P2 - Lesões múltiplas superficiais</SelectItem>
                        <SelectItem value="P3">P3 - Lesões profundas ou aderências</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-yellow-800">Tamanho</Label>
                    <Select onValueChange={(value) => handleClassificationChange('peritoneumSize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<3cm">Σ＜3 cm</SelectItem>
                        <SelectItem value="3-7cm">Σ3 - 7 cm</SelectItem>
                        <SelectItem value=">7cm">Σ＞7 cm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* OVÁRIO - Azul */}
              <Card className="border-2 border-blue-400 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                    OVÁRIO
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Classificação das lesões ovarianas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-blue-800">Classificação</Label>
                    <Select onValueChange={(value) => handleClassificationChange('ovary', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione O1, O2 ou O3" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="O1">O1 - Endometrioma superficial</SelectItem>
                        <SelectItem value="O2">O2 - Endometrioma profundo</SelectItem>
                        <SelectItem value="O3">O3 - Endometrioma bilateral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-blue-800">Tamanho</Label>
                    <Select onValueChange={(value) => handleClassificationChange('ovarySize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<3cm">Σ＜3 cm</SelectItem>
                        <SelectItem value="3-7cm">Σ3 - 7 cm</SelectItem>
                        <SelectItem value=">7cm">Σ＞7 cm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* TUBA - Verde */}
              <Card className="border-2 border-green-400 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                    TUBA
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Classificação das lesões tubárias
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-green-800">Classificação</Label>
                    <Select onValueChange={(value) => handleClassificationChange('tube', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione T1, T2 ou T3" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="T1">T1 - Lesão tubária unilateral</SelectItem>
                        <SelectItem value="T2">T2 - Lesão tubária bilateral</SelectItem>
                        <SelectItem value="T3">T3 - Obstrução tubária completa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-green-800">Tamanho</Label>
                    <Select onValueChange={(value) => handleClassificationChange('tubeSize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<3cm">Σ＜3 cm</SelectItem>
                        <SelectItem value="3-7cm">Σ3 - 7 cm</SelectItem>
                        <SelectItem value=">7cm">Σ＞7 cm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* ENDOMETRIOSE PROFUNDA - Vermelho */}
              <Card className="border-2 border-red-400 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                    ENDOMETRIOSE PROFUNDA
                  </CardTitle>
                  <CardDescription className="text-red-700">
                    Classificação da endometriose profunda infiltrativa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-red-800">Classificação</Label>
                    <Select onValueChange={(value) => handleClassificationChange('deepEndometriosis', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione A, B ou C" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A - Infiltração superficial</SelectItem>
                        <SelectItem value="B">B - Infiltração profunda</SelectItem>
                        <SelectItem value="C">C - Infiltração de órgãos adjacentes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-red-800">Tamanho</Label>
                    <Select onValueChange={(value) => handleClassificationChange('deepEndometriosisSize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<3cm">Σ＜3 cm</SelectItem>
                        <SelectItem value="3-7cm">Σ3 - 7 cm</SelectItem>
                        <SelectItem value=">7cm">Σ＞7 cm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Observações e Resultados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                  <CardDescription>
                    Adicione notas adicionais sobre o diagnóstico
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Digite suas observações aqui..."
                    value={classification.observations}
                    onChange={(e) => handleClassificationChange('observations', e.target.value)}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>

              <DiagnosisResults 
                classification={classification} 
                patientId={selectedPatient}
                doctorId={selectedDoctor}
                patientData={patients.find(p => p.id === selectedPatient)}
                doctorData={doctors.find(d => d.id === selectedDoctor)}
              />
            </div>
          </TabsContent>

          <TabsContent value="patients">
            <PatientForm />
          </TabsContent>

          <TabsContent value="doctors">
            <DoctorManagement />
          </TabsContent>

          <TabsContent value="history">
            <PatientHistory />
          </TabsContent>

          <TabsContent value="reference">
            <ReferenceSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}