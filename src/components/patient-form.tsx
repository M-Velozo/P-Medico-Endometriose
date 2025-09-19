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
import { UserPlus, Search, Calendar, Phone, Mail, Loader2, Edit, Trash2, Save, X } from 'lucide-react'

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

export function PatientForm() {
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    medicalRecord: ''
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

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.medicalRecord?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient)
    setFormData({
      name: patient.name,
      email: patient.email || '',
      phone: patient.phone || '',
      dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
      medicalRecord: patient.medicalRecord || ''
    })
    setSelectedDoctor(patient.doctor?.id || doctors[0]?.id || '')
    setIsEditing(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPatient || !selectedDoctor) return

    setLoading(true)
    try {
      const response = await fetch(`/api/patients/${editingPatient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          doctorId: selectedDoctor
        }),
      })

      if (response.ok) {
        await fetchPatients()
        setIsEditing(false)
        setEditingPatient(null)
        setFormData({ name: '', email: '', phone: '', dateOfBirth: '', medicalRecord: '' })
      } else {
        console.error('Error updating patient')
      }
    } catch (error) {
      console.error('Error updating patient:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (patientId: string) => {
    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchPatients()
      } else {
        console.error('Error deleting patient')
      }
    } catch (error) {
      console.error('Error deleting patient:', error)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditingPatient(null)
    setFormData({ name: '', email: '', phone: '', dateOfBirth: '', medicalRecord: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoctor) return

    setLoading(true)
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          doctorId: selectedDoctor
        }),
      })

      if (response.ok) {
        await fetchPatients()
        setIsCreating(false)
        setFormData({ name: '', email: '', phone: '', dateOfBirth: '', medicalRecord: '' })
      } else {
        console.error('Error creating patient')
      }
    } catch (error) {
      console.error('Error creating patient:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Gerenciamento de Pacientes
          </CardTitle>
          <CardDescription>
            Selecione um paciente existente ou cadastre um novo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar paciente por nome ou prontuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={() => setIsCreating(!isCreating)}
              variant={isCreating ? "outline" : "default"}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Paciente
            </Button>
          </div>
        </CardContent>
      </Card>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Novo Paciente</CardTitle>
            <CardDescription>
              Preencha os dados do novo paciente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="medicalRecord">Prontuário</Label>
                  <Input
                    id="medicalRecord"
                    value={formData.medicalRecord}
                    onChange={(e) => handleInputChange('medicalRecord', e.target.value)}
                    placeholder="Número do prontuário"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(11) 98765-4321"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="doctor">Médico Responsável *</Label>
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
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Paciente'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreating(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Modal de Edição */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
            <DialogDescription>
              Atualize os dados do paciente
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nome Completo *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Digite o nome completo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-medicalRecord">Prontuário</Label>
                <Input
                  id="edit-medicalRecord"
                  value={formData.medicalRecord}
                  onChange={(e) => handleInputChange('medicalRecord', e.target.value)}
                  placeholder="Número do prontuário"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 98765-4321"
                />
              </div>
              <div>
                <Label htmlFor="edit-dateOfBirth">Data de Nascimento</Label>
                <Input
                  id="edit-dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-doctor">Médico Responsável *</Label>
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
            <DialogFooter className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={cancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Pacientes Cadastrados</CardTitle>
          <CardDescription>
            {filteredPatients.length} paciente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPatients.map((patient) => (
              <div 
                key={patient.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      {patient.medicalRecord && (
                        <Badge variant="outline">{patient.medicalRecord}</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      {patient.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {patient.email}
                        </div>
                      )}
                      {patient.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {patient.phone}
                        </div>
                      )}
                      {patient.dateOfBirth && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(patient.dateOfBirth).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                    {patient.doctor && (
                      <div className="text-xs text-gray-500 mt-1">
                        Médico: {patient.doctor.name}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(patient)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o paciente "{patient.name}"? Esta ação não pode ser desfeita e todos os diagnósticos relacionados serão excluídos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(patient.id)}
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
            
            {filteredPatients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum paciente encontrado</p>
                <p className="text-sm">Cadastre um novo paciente ou ajuste sua busca</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}