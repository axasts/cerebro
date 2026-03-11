import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import Layout from './layouts/Layout'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f0f0f', color: '#7C3AED' }}>
      Cargando...
    </div>
  )

  return session ? <Layout session={session} /> : <Login />
}

export default App