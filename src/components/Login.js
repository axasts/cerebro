import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [modo, setModo] = useState('login')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (modo === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Email o contraseña incorrectos')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError('Error al crear la cuenta')
      else setError('Revisa tu email para confirmar la cuenta')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    background: '#252540',
    border: '1px solid #2e2e4e',
    borderRadius: '8px',
    color: '#e8e8ff',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif'
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#1e1e32'
    }}>
      <div style={{
        background: '#16162a',
        padding: '40px',
        borderRadius: '16px',
        width: '360px',
        border: '1px solid #22223a'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#7c3aed', boxShadow: '0 0 10px #7c3aed88'
          }} />
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '20px',
            fontWeight: '800',
            color: '#e0e0f5',
            letterSpacing: '-0.3px'
          }}>Cerebro</span>
        </div>
        <p style={{ color: '#3a3a5a', fontSize: '13px', marginBottom: '32px' }}>
          {modo === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <input type="email" placeholder="Email" value={email}
              onChange={e => setEmail(e.target.value)} required style={inputStyle} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <input type="password" placeholder="Contraseña" value={password}
              onChange={e => setPassword(e.target.value)} required style={inputStyle} />
          </div>

          {error && (
            <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '16px' }}>{error}</p>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '11px',
            background: '#7c3aed', border: 'none', borderRadius: '8px',
            color: 'white', fontSize: '13px', cursor: 'pointer',
            fontWeight: '500', fontFamily: 'DM Sans, sans-serif'
          }}>
            {loading ? 'Cargando...' : modo === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#3a3a5a' }}>
          {modo === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <span onClick={() => setModo(modo === 'login' ? 'registro' : 'login')}
            style={{ color: '#a78bfa', cursor: 'pointer' }}>
            {modo === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </span>
        </p>
      </div>
    </div>
  )
}