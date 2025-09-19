'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { UserPlus, Search, Edit, Trash2, Users, Stethoscope, Mail, Phone, Calendar, Loader2 } from 'lucide-react'

interface Doctor {
  id: string
  name: string
  email: string
  crm: string
  specialty: string
  phone?: string
  createdAt: string
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

export function DoctorsManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    crm: '',
    specialty: '',
    phone: ''
  })

  useEffect(() => {
    fetchDoctors()
  }, [])

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

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.crm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingDoctor) {
        // Update existing doctor
        const response = await fetch(`/api/doctors/${editingDoctor.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          await fetchDoctors()
          setIsDialogOpen(false)
          resetForm()
        } else {
          const error = await response.json()
          alert(error.error || 'Erro ao atualizar médico')
        }
      } else {
        // Create new doctor
        const response = await fetch('/api/doctors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          await fetchDoctors()
          setIsDialogOpen(false)
          resetForm()
        } else {
          const error = await response.json()
          alert(error.error || 'Erro ao criar médico')
        }
      }
    } catch (error) {
      console.error('Error saving doctor:', error)
      alert('Erro ao salvar médico')
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
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao excluir médico')
      }
    } catch (error) {
      console.error('Error deleting doctor:', error)
      alert('Erro ao excluir médico')
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
                    {editingDoctor 
                      ? 'Atualize os dados do médico selecionado'
                      : 'Preencha os dados para cadastrar um novo médico'
                    }
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
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="joao.silva@exemplo.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="crm">CRM *</Label>
                      <Input
                        id="crm"
                        value={formData.crm}
                        onChange={(e) => handleInputChange('crm', e.target.value)}
                        placeholder="123456"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="specialty">Especialidade *</Label>
                      <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                        <SelectTrigger>
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
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {editingDoctor ? 'Atualizando...' : 'Cadastrando...'}
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Médicos Cadastrados
            </div>
            <Badge variant="outline">
              {filteredDoctors.length} médico(s)
            </Badge>
          </CardTitle>
          <CardDescription>
            Lista de todos os profissionais de saúde cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
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
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                        <Badge variant="secondary">{doctor.specialty}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {doctor.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Stethoscope className="w-3 h-3" />
                          CRM: {doctor.crm}
                        </div>
                        {doctor.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {doctor.phone}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        Cadastrado em {new Date(doctor.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(doctor)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
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
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
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