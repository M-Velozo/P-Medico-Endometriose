'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Save, Share2, Loader2, Download } from 'lucide-react'
import { useState } from 'react'
import { PDFGenerator } from './pdf-generator'

interface DiagnosisResultsProps {
  classification: {
    peritoneum: string
    peritoneumSize: string
    ovary: string
    ovarySize: string
    tube: string
    tubeSize: string
    deepEndometriosis: string
    deepEndometriosisSize: string
    observations: string
  }
  patientId?: string
  doctorId?: string
  patientData?: {
    name: string
    email?: string
    phone?: string
    dateOfBirth?: string
    medicalRecord?: string
  }
  doctorData?: {
    name: string
    email: string
    crm: string
    specialty: string
  }
}

export function DiagnosisResults({ classification, patientId, doctorId, patientData, doctorData }: DiagnosisResultsProps) {
  const [loading, setLoading] = useState(false)
  const [showPDFGenerator, setShowPDFGenerator] = useState(false)

  const calculateFinalClassification = () => {
    const { peritoneum, ovary, tube, deepEndometriosis } = classification
    if (peritoneum && ovary && tube && deepEndometriosis) {
      return `${peritoneum}${ovary}${tube}${deepEndometriosis}`
    }
    return null
  }

  const getSeverityLevel = (classification: string) => {
    // Lógica para determinar o nível de severidade baseado na classificação
    const severeCount = classification.split('').filter(char => 
      ['P3', 'O3', 'T3', 'C'].includes(char)
    ).length
    
    if (severeCount >= 3) return { level: 'Grave', color: 'bg-red-500' }
    if (severeCount >= 2) return { level: 'Moderado-Grave', color: 'bg-orange-500' }
    if (severeCount >= 1) return { level: 'Moderado', color: 'bg-yellow-500' }
    return { level: 'Leve', color: 'bg-green-500' }
  }

  const finalClassification = calculateFinalClassification()
  const severity = finalClassification ? getSeverityLevel(finalClassification) : null

  const handleSaveDiagnosis = async () => {
    if (!patientId || !doctorId || !finalClassification) {
      alert('Selecione um paciente e verifique se todas as classificações foram preenchidas')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/diagnoses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          doctorId,
          ...classification,
          finalClassification
        }),
      })

      if (response.ok) {
        alert('Diagnóstico salvo com sucesso!')
      } else {
        alert('Erro ao salvar diagnóstico')
      }
    } catch (error) {
      console.error('Error saving diagnosis:', error)
      alert('Erro ao salvar diagnóstico')
    } finally {
      setLoading(false)
    }
  }

  const handleGeneratePDF = () => {
    if (!finalClassification) {
      alert('Complete todas as classificações para gerar o PDF')
      return
    }
    setShowPDFGenerator(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Resultado do Diagnóstico
        </CardTitle>
        <CardDescription>
          Classificação final e ações disponíveis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {finalClassification ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Classificação Final</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {finalClassification}
              </div>
              {severity && (
                <Badge className={`${severity.color} text-white`}>
                  {severity.level}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Peritônio:</span>
                <span className="font-medium">{classification.peritoneum}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ovário:</span>
                <span className="font-medium">{classification.ovary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tuba:</span>
                <span className="font-medium">{classification.tube}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Endometriose Profunda:</span>
                <span className="font-medium">{classification.deepEndometriosis}</span>
              </div>
            </div>

            {classification.observations && (
              <div className="border-t pt-4">
                <div className="text-sm text-gray-600 mb-2">Observações:</div>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">
                  {classification.observations}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button 
                className="flex-1" 
                size="sm"
                onClick={handleSaveDiagnosis}
                disabled={loading || !patientId}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Diagnóstico
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                size="sm"
                onClick={handleGeneratePDF}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Gerar PDF
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Complete todas as classificações para ver o resultado</p>
          </div>
        )}

        {showPDFGenerator && finalClassification && patientData && doctorData && (
          <div className="mt-6 border-t pt-6">
            <PDFGenerator
              diagnosis={{
                finalClassification,
                ...classification
              }}
              patient={patientData}
              doctor={doctorData}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}