'use client'
import { useState } from 'react'
import { Card, CardContent } from "../../../components/ui/Card"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (res.ok) {
      window.location.href = '/admin/dashboard'
    } else {
      setError('Credenciales incorrectas')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold text-center">Login Administrador</h2>
            <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <div className="text-red-500">{error}</div>}
            <Button className="w-full" type="submit">Ingresar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
