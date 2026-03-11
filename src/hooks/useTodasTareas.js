import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function useTodasTareas(userId) {
  const [tareas, setTareas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) cargarTareas()
  }, [userId])

  const cargarTareas = async () => {
    const { data } = await supabase
      .from('tareas')
      .select('*')
      .eq('user_id', userId)
      .eq('completada', false)
      .order('creado_at')
    setTareas(data || [])
    setLoading(false)
  }

  return { tareas, loading }
}