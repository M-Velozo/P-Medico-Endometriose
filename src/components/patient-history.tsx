'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { History, Calendar, User, FileText, TrendingUp, Clock } from 'lucide-react'

interface Diagnosis {
  id: string
  finalClassification: string
  peritoneum: string
  ovary: string
  tube: string
  deepEndometriosis: string
  observations?: string
  createdAt: string
  patient: {
    name: string
    medicalRecord?: string
  }
  doctor: {
    name: string
    crm: string
  }
}

interface Patient {
  id: string
  name: string
  medicalRecord?: string
}

export function PatientHistory() {
  const [selectedPatient, setSelectedPatient] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    if (selectedPatient) {
      fetchDiagnoses(selectedPatient)
    }
  }, [selectedPatient])

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

  const fetchDiagnoses = async (patientId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/diagnoses?patientId=${patientId}`)
      if (response.ok) {
        const data = await response.json()
        setDiagnoses(data)
      }
    } catch (error) {
      console.error('Error fetching diagnoses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (classification: string) => {
    const severeCount = classification.split('').filter(char => 
      ['P3', 'O3', 'T3', 'C'].includes(char)
    ).length
    
    if (severeCount >= 3) return 'bg-red-500'
    if (severeCount >= 2) return 'bg-orange-500'
    if (severeCount >= 1) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getSeverityLevel = (classification: string) => {
    const severeCount = classification.split('').filter(char => 
      ['P3', 'O3', 'T3', 'C'].includes(char)
    ).length
    
    if (severeCount >= 3) return 'Grave'
    if (severeCount >= 2) return 'Moderado-Grave'
    if (severeCount >= 1) return 'Moderado'
    return 'Leve'
  }

  const getTrendIndicator = (current: string, previous?: string) => {
    if (!previous) return null
    
    const currentSevere = current.split('').filter(char => 
      ['P3', 'O3', 'T3', 'C'].includes(char)
    ).length
    
    const previousSevere = previous.split('').filter(char => 
      ['P3', 'O3', 'T3', 'C'].includes(char)
    ).length
    
    if (currentSevere > previousSevere) {
      return { trend: 'up', color: 'text-red-500', label: 'Piora' }
    } else if (currentSevere < previousSevere) {
      return { trend: 'down', color: 'text-green-500', label: 'Melhora' }
    } else {
      return { trend: 'stable', color: 'text-gray-500', label: 'Estável' }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Histórico de Diagnósticos
          </CardTitle>
          <CardDescription>
            Visualize o histórico de classificações e acompanhe a evolução dos pacientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
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
          </div>
        </CardContent>
      </Card>

      {selectedPatient && (
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Clock className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
                  <p className="text-gray-500">Carregando histórico...</p>
                </div>
              </CardContent>
            </Card>
          ) : diagnoses.length > 0 ? (
            <>
              {/* Resumo da Evolução */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Resumo da Evolução
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {diagnoses.length}
                      </div>
                      <div className="text-sm text-gray-600">Total de Consultas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {diagnoses[0]?.finalClassification}
                      </div>
                      <div className="text-sm text-gray-600">Classificação Atual</div>
                    </div>
                    <div className="text-center">
                      <Badge className={`${getSeverityColor(diagnoses[0]?.finalClassification)} text-white`}>
                        {getSeverityLevel(diagnoses[0]?.finalClassification)}
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1">Nível de Severidade</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Diagnósticos */}
              <div className="space-y-4">
                {diagnoses.map((diagnosis, index) => {
                  const previousDiagnosis = index < diagnoses.length - 1 ? diagnoses[index + 1] : null
                  const trend = getTrendIndicator(diagnosis.finalClassification, previousDiagnosis?.finalClassification)
                  
                  return (
                    <Card key={diagnosis.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <span className="font-semibold">
                                {diagnosis.finalClassification}
                              </span>
                              <Badge className={`${getSeverityColor(diagnosis.finalClassification)} text-white`}>
                                {getSeverityLevel(diagnosis.finalClassification)}
                              </Badge>
                              {trend && (
                                <div className={`flex items-center gap-1 text-sm ${trend.color}`}>
                                  <TrendingUp className={`w-4 h-4 ${trend.trend === 'down' ? 'rotate-180' : ''}`} />
                                  {trend.label}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(diagnosis.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Peritônio:</span>
                              <div className="font-medium">{diagnosis.peritoneum}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Ovário:</span>
                              <div className="font-medium">{diagnosis.ovary}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Tuba:</span>
                              <div className="font-medium">{diagnosis.tube}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Endometriose Profunda:</span>
                              <div className="font-medium">{diagnosis.deepEndometriosis}</div>
                            </div>
                          </div>
                          
                          {diagnosis.observations && (
                            <div>
                              <span className="text-gray-600 text-sm">Observações:</span>
                              <p className="text-sm bg-gray-50 p-3 rounded mt-1">
                                {diagnosis.observations}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              Médico: {diagnosis.doctor.name} (CRM: {diagnosis.doctor.crm})
                            </div>
                            <Button variant="outline" size="sm">
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-2">Nenhum diagnóstico encontrado</p>
                  <p className="text-sm text-gray-400">
                    Este paciente ainda não possui classificações registradas
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!selectedPatient && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-2">Selecione um paciente</p>
              <p className="text-sm text-gray-400">
                Escolha um paciente para visualizar seu histórico de diagnósticos
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}