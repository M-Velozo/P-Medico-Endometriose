'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, Calendar, User, Mail, Phone } from 'lucide-react'

interface PDFGeneratorProps {
  diagnosis: {
    finalClassification: string
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
  patient: {
    name: string
    email?: string
    phone?: string
    dateOfBirth?: string
    medicalRecord?: string
  }
  doctor: {
    name: string
    email: string
    crm: string
    specialty: string
  }
}

export function PDFGenerator({ diagnosis, patient, doctor }: PDFGeneratorProps) {
  const [loading, setLoading] = useState(false)

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

  const generatePDFContent = () => {
    const currentDate = new Date().toLocaleDateString('pt-BR')
    const severity = getSeverityLevel(diagnosis.finalClassification)
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Relatório de Classificação de Endometriose</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .title {
            color: #1f2937;
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .subtitle {
            color: #6b7280;
            margin: 10px 0 0 0;
            font-size: 14px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            color: #374151;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            border-left: 4px solid #3b82f6;
            padding-left: 10px;
        }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .field {
            margin-bottom: 8px;
        }
        .label {
            font-weight: bold;
            color: #6b7280;
            font-size: 12px;
        }
        .value {
            color: #1f2937;
            font-size: 14px;
        }
        .classification-result {
            text-align: center;
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .classification-code {
            font-size: 32px;
            font-weight: bold;
            color: #1f2937;
            margin: 0;
        }
        .severity {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            color: white;
            font-size: 12px;
            font-weight: bold;
            margin-top: 10px;
        }
        .classification-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        .classification-item {
            text-align: center;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }
        .classification-item .code {
            font-weight: bold;
            color: #1f2937;
            font-size: 16px;
        }
        .classification-item .desc {
            color: #6b7280;
            font-size: 11px;
            margin-top: 5px;
        }
        .observations {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">Relatório de Classificação de Endometriose</h1>
            <p class="subtitle">Classificação de Keckstein (Enzian) - Sistema de Diagnóstico Padronizado</p>
            <p class="subtitle">Data: ${currentDate}</p>
        </div>

        <div class="section">
            <div class="section-title">Informações do Paciente</div>
            <div class="grid">
                <div class="field">
                    <div class="label">Nome:</div>
                    <div class="value">${patient.name}</div>
                </div>
                <div class="field">
                    <div class="label">Prontuário:</div>
                    <div class="value">${patient.medicalRecord || 'Não informado'}</div>
                </div>
                <div class="field">
                    <div class="label">Data de Nascimento:</div>
                    <div class="value">${patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('pt-BR') : 'Não informada'}</div>
                </div>
                <div class="field">
                    <div class="label">Contato:</div>
                    <div class="value">${patient.phone || patient.email || 'Não informado'}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Médico Responsável</div>
            <div class="grid">
                <div class="field">
                    <div class="label">Nome:</div>
                    <div class="value">${doctor.name}</div>
                </div>
                <div class="field">
                    <div class="label">Especialidade:</div>
                    <div class="value">${doctor.specialty}</div>
                </div>
                <div class="field">
                    <div class="label">CRM:</div>
                    <div class="value">${doctor.crm}</div>
                </div>
                <div class="field">
                    <div class="label">Email:</div>
                    <div class="value">${doctor.email}</div>
                </div>
            </div>
        </div>

        <div class="classification-result">
            <div class="label">Classificação Final</div>
            <div class="classification-code">${diagnosis.finalClassification}</div>
            <div class="severity" style="background-color: ${getSeverityColor(diagnosis.finalClassification)}">
                ${severity}
            </div>
        </div>

        <div class="section">
            <div class="section-title">Detalhes da Classificação</div>
            <div class="classification-grid">
                <div class="classification-item">
                    <div class="code">${diagnosis.peritoneum}</div>
                    <div class="desc">Peritônio</div>
                </div>
                <div class="classification-item">
                    <div class="code">${diagnosis.ovary}</div>
                    <div class="desc">Ovário</div>
                </div>
                <div class="classification-item">
                    <div class="code">${diagnosis.tube}</div>
                    <div class="desc">Tuba</div>
                </div>
                <div class="classification-item">
                    <div class="code">${diagnosis.deepEndometriosis}</div>
                    <div class="desc">Endometriose Profunda</div>
                </div>
            </div>
        </div>

        ${diagnosis.observations ? `
        <div class="section">
            <div class="section-title">Observações</div>
            <div class="observations">
                ${diagnosis.observations}
            </div>
        </div>
        ` : ''}

        <div class="footer">
            <p>Este relatório foi gerado pelo Sistema de Classificação de Endometriose - Classificação de Keckstein</p>
            <p>Referência: Keckstein J, et al. The #Enzian classification: a comprehensive system for classifying endometriosis. Hum Reprod Open. 2021.</p>
        </div>
    </div>
</body>
</html>
    `
  }

  const handleGeneratePDF = async () => {
    setLoading(true)
    try {
      const content = generatePDFContent()
      
      // Criar uma nova janela com o conteúdo
      const newWindow = window.open('', '_blank')
      if (newWindow) {
        newWindow.document.write(content)
        newWindow.document.close()
        
        // Esperar um pouco para o conteúdo carregar
        setTimeout(() => {
          newWindow.print()
        }, 1000)
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Erro ao gerar PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Gerar Relatório PDF
        </CardTitle>
        <CardDescription>
          Gere um relatório completo em formato PDF para impressão ou compartilhamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Paciente:</span>
            <div className="font-medium">{patient.name}</div>
          </div>
          <div>
            <span className="text-gray-600">Classificação:</span>
            <div className="font-medium">{diagnosis.finalClassification}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge className={`${getSeverityColor(diagnosis.finalClassification)} text-white`}>
            {getSeverityLevel(diagnosis.finalClassification)}
          </Badge>
          <Button onClick={handleGeneratePDF} disabled={loading}>
            <Download className="w-4 h-4 mr-2" />
            {loading ? 'Gerando...' : 'Gerar PDF'}
          </Button>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p>O PDF será aberto em uma nova janela. Você pode salvá-lo ou imprimi-lo diretamente do navegador.</p>
        </div>
      </CardContent>
    </Card>
  )
}