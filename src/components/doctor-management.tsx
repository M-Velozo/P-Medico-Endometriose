'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Calendar, 
  Loader2,
  Stethoscope,
  Shield,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useToast } from './toast-notifications'

interface Doctor {
  id: string
  name: string
  email: string
  crm: string
  specialty: string
  phone?: string
  createdAt: string
  updatedAt: string
}

const specialties = [
  'Ginecologia',
  'Obstetrícia',
  'Ginecologia e Obstetrícia',
  'Reprodução Humana',
  'Endocrinologia Ginecológica',
  'Mastologia',
  'Uroginecologia'
]

export function DoctorManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  
  const toast = useToast()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    crm: '',
    specialty: '',
    phone: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    filterDoctors()
  }, [doctors, searchTerm])

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/doctors')
      if (response.ok) {
        const data = await response.json()
        setDoctors(data)
      }
    } catch (error) {
      console.error('Error fetching doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterDoctors = () => {
    if (!searchTerm) {
      setFilteredDoctors(doctors)
      return
    }

    const filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.crm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDoctors(filtered)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpar erro quando o campo é editado
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.crm.trim()) {
      newErrors.crm = 'CRM é obrigatório'
    }

    if (!formData.specialty) {
      newErrors.specialty = 'Especialidade é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const url = editingDoctor ? `/api/doctors/${editingDoctor.id}` : '/api/doctors'
      const method = editingDoctor ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchDoctors()
        resetForm()
        setIsDialogOpen(false)
        toast.success(editingDoctor ? 'Médico atualizado com sucesso!' : 'Médico cadastrado com sucesso!')
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.error || 'Erro ao salvar médico' })
        toast.error(errorData.error || 'Erro ao salvar médico')
      }
    } catch (error) {
      console.error('Error saving doctor:', error)
      setErrors({ submit: 'Erro ao salvar médico' })
      toast.error('Erro ao salvar médico')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setFormData({
      name: doctor.name,
      email: doctor.email,
      crm: doctor.crm,
      specialty: doctor.specialty,
      phone: doctor.phone || ''
    })
    setErrors({})
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/doctors/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchDoctors()
        toast.success('Médico excluído com sucesso!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Erro ao excluir médico')
      }
    } catch (error) {
      console.error('Error deleting doctor:', error)
      toast.error('Erro ao excluir médico')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      crm: '',
      specialty: '',
      phone: ''
    })
    setEditingDoctor(null)
    setErrors({})
  }

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm()
    }
    setIsDialogOpen(open)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            Gerenciamento de Médicos
          </CardTitle>
          <CardDescription>
            Cadastre e gerencie os profissionais de saúde do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome, email, CRM ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Novo Médico
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingDoctor ? 'Editar Médico' : 'Cadastrar Novo Médico'}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os dados do profissional de saúde
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Dr. João Silva"
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="joao.silva@exemplo.com"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="crm">CRM *</Label>
                      <Input
                        id="crm"
                        value={formData.crm}
                        onChange={(e) => handleInputChange('crm', e.target.value)}
                        placeholder="123456"
                        className={errors.crm ? 'border-red-500' : ''}
                      />
                      {errors.crm && (
                        <p className="text-red-500 text-xs mt-1">{errors.crm}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="specialty">Especialidade *</Label>
                      <Select 
                        value={formData.specialty} 
                        onValueChange={(value) => handleInputChange('specialty', value)}
                      >
                        <SelectTrigger className={errors.specialty ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione a especialidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.specialty && (
                        <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="(11) 98765-4321"
                      />
                    </div>
                  </div>
                  
                  {errors.submit && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.submit}
                    </div>
                  )}

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        editingDoctor ? 'Atualizar' : 'Cadastrar'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Médicos Cadastrados</CardTitle>
          <CardDescription>
            {filteredDoctors.length} médico(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && doctors.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDoctors.map((doctor) => (
                <div 
                  key={doctor.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                        <Badge variant="outline">{doctor.specialty}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {doctor.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          CRM: {doctor.crm}
                        </div>
                        {doctor.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {doctor.phone}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                        <Calendar className="w-3 h-3" />
                        Cadastrado em {new Date(doctor.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(doctor)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o médico "{doctor.name}"? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(doctor.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredDoctors.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Stethoscope className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum médico encontrado</p>
                  <p className="text-sm">Cadastre um novo médico ou ajuste sua busca</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}