'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Shield, User, Lock, AlertCircle } from 'lucide-react'

interface AuthLoginProps {
  onLogin: (doctor: any) => void
}

export function AuthLogin({ onLogin }: AuthLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulação de login - em produção, isso seria uma chamada de API real
      const response = await fetch('/api/doctors')
      const doctors = await response.json()
      
      const doctor = doctors.find((d: any) => d.email === email)
      
      if (doctor) {
        // Simulação de validação de senha
        // Em produção, você usaria um sistema de autenticação real
        if (password === 'demo123') {
          onLogin(doctor)
        } else {
          setError('Senha incorreta')
        }
      } else {
        setError('Médico não encontrado')
      }
    } catch (error) {
      setError('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Sistema de Classificação</CardTitle>
          <CardDescription>
            Acesso para profissionais de saúde
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Demo</Badge>
              <span className="text-sm font-medium">Acesso de demonstração</span>
            </div>
            <p className="text-xs text-gray-600">
              Use o email <code className="bg-gray-100 px-1 rounded">joao.silva@exemplo.com</code> e senha <code className="bg-gray-100 px-1 rounded">demo123</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}