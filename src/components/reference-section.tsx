'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, ExternalLink, FileText, Calendar, Users } from 'lucide-react'

export function ReferenceSection() {
  const references = [
    {
      id: 1,
      title: "Keckstein J, Ulrich U, Possover M, Schweppe KW. The #Enzian classification: a comprehensive system for classifying endometriosis. Hum Reprod Open. 2021;2021(4):hoab039.",
      authors: "Keckstein J, Ulrich U, Possover M, Schweppe KW",
      year: "2021",
      journal: "Human Reproduction Open",
      type: "Artigo Original",
      doi: "10.1093/hropen/hoab039",
      url: "https://doi.org/10.1093/hropen/hoab039",
      description: "Artigo original que descreve a classificação de Enzian para endometriose, fornecendo um sistema abrangente para classificar a doença."
    },
    {
      id: 2,
      title: "Keckstein J, Wiesinger H. The Enzian classification for deep infiltrating endometriosis of the rectovaginal septum, vagina, bladder, and ureter. J Minim Invasive Gynecol. 2021;28(7):1417-1425.",
      authors: "Keckstein J, Wiesinger H",
      year: "2021",
      journal: "Journal of Minimally Invasive Gynecology",
      type: "Revisão",
      doi: "10.1016/j.jmig.2021.02.019",
      url: "https://doi.org/10.1016/j.jmig.2021.02.019",
      description: "Revisão detalhada focada na classificação de endometriose profunda infiltrativa em locais específicos."
    },
    {
      id: 3,
      title: "The Enzian Classification: A New System for Classifying Deep Infiltrating Endometriosis. European Society of Human Reproduction and Embryology (ESHRE).",
      authors: "ESHRE Special Interest Group on Endometriosis and Endometrial Disorders",
      year: "2021",
      journal: "ESHRE Guidelines",
      type: "Diretriz",
      url: "https://www.eshre.eu/Specialty-groups/Specialty-Groups/Endometriosis-and-Endometrial-disorders.aspx",
      description: "Diretrizes oficiais da ESHRE sobre a classificação de Enzian para endometriose profunda infiltrativa."
    }
  ]

  const classificationLevels = [
    {
      category: "Peritônio (P)",
      levels: [
        { code: "P1", description: "Lesões superficiais isoladas", severity: "Leve" },
        { code: "P2", description: "Lesões múltiplas superficiais", severity: "Moderado" },
        { code: "P3", description: "Lesões profundas ou aderências", severity: "Grave" }
      ]
    },
    {
      category: "Ovário (O)",
      levels: [
        { code: "O1", description: "Endometrioma superficial", severity: "Leve" },
        { code: "O2", description: "Endometrioma profundo", severity: "Moderado" },
        { code: "O3", description: "Endometrioma bilateral", severity: "Grave" }
      ]
    },
    {
      category: "Tuba (T)",
      levels: [
        { code: "T1", description: "Lesão tubária unilateral", severity: "Leve" },
        { code: "T2", description: "Lesão tubária bilateral", severity: "Moderado" },
        { code: "T3", description: "Obstrução tubária completa", severity: "Grave" }
      ]
    },
    {
      category: "Endometriose Profunda (A/B/C)",
      levels: [
        { code: "A", description: "Infiltração superficial", severity: "Leve" },
        { code: "B", description: "Infiltração profunda", severity: "Moderado" },
        { code: "C", description: "Infiltração de órgãos adjacentes", severity: "Grave" }
      ]
    }
  ]

  const getSizeDescription = (size: string) => {
    switch (size) {
      case "<3cm": return "Σ＜3 cm - Lesões pequenas"
      case "3-7cm": return "Σ3 - 7 cm - Lesões moderadas"
      case ">7cm": return "Σ＞7 cm - Lesões grandes"
      default: return size
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Referência Bibliográfica
          </CardTitle>
          <CardDescription>
            Fontes científicas e documentação da Classificação de Keckstein (Enzian)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Referências Principais */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Referências Científicas
              </h3>
              <div className="space-y-4">
                {references.map((ref) => (
                  <div key={ref.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline">{ref.type}</Badge>
                      <span className="text-sm text-gray-500">{ref.year}</span>
                    </div>
                    <h4 className="font-medium text-sm mb-2">{ref.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{ref.authors}</p>
                    <p className="text-xs text-gray-700 mb-3">{ref.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{ref.journal}</span>
                      <Button variant="outline" size="sm" asChild>
                        <a href={ref.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          DOI
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detalhes da Classificação */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Detalhes da Classificação
              </h3>
              <div className="space-y-4">
                {classificationLevels.map((category) => (
                  <div key={category.category} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">{category.category}</h4>
                    <div className="space-y-2">
                      {category.levels.map((level) => (
                        <div key={level.code} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{level.code}</Badge>
                            <span>{level.description}</span>
                          </div>
                          <Badge 
                            className={
                              level.severity === "Leve" ? "bg-green-500 text-white" :
                              level.severity === "Moderado" ? "bg-yellow-500 text-white" :
                              "bg-red-500 text-white"
                            }
                          >
                            {level.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Informações sobre Tamanhos */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Critérios de Tamanho
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">Σ＜3 cm</div>
                <div className="text-sm text-gray-600">Lesões pequenas</div>
                <div className="text-xs text-gray-500 mt-1">Somatório das lesões menor que 3 cm</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 mb-2">Σ3 - 7 cm</div>
                <div className="text-sm text-gray-600">Lesões moderadas</div>
                <div className="text-xs text-gray-500 mt-1">Somatório entre 3 e 7 cm</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600 mb-2">Σ＞7 cm</div>
                <div className="text-sm text-gray-600">Lesões grandes</div>
                <div className="text-xs text-gray-500 mt-1">Somatório maior que 7 cm</div>
              </div>
            </div>
          </div>

          {/* Nota Importante */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Nota Importante</h4>
            <p className="text-sm text-blue-800">
              A Classificação de Keckstein (também conhecida como Classificação de Enzian) é um sistema 
              desenvolvido para fornecer uma avaliação padronizada da endometriose profunda infiltrativa. 
              Ela complementa outras classificações como a rAFS, focando especificamente em lesões profundas 
              que podem não ser adequadamente classificadas por sistemas tradicionais.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}