import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function useTareas(userId, proyectoId) {
  const [tareas, setTareas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId && proyectoId) cargarTareas()
  }, [userId, proyectoId])

  const cargarTareas = async () => {
    const { data } = await supabase
      .from('tareas')
      .select('*')
      .eq('user_id', userId)
      .eq('proyecto_id', proyectoId)
      .order('creado_at')
    setTareas(data || [])
    setLoading(false)
  }

 const crearTarea = async (titulo, prioridad = 'normal', fechaLimite = null, descripcion = null) => {
    const { data } = await supabase
      .from('tareas')
      .insert([{ titulo, prioridad, fecha_limite: fechaLimite, descripcion, proyecto_id: proyectoId, user_id: userId }])
      .select()
      .single()
    setTareas(prev => [...prev, data])
    return data
  }

  const completarTarea = async (id, completada) => {
    await supabase.from('tareas').update({ completada }).eq('id', id)
    setTareas(prev => prev.map(t => t.id === id ? { ...t, completada } : t))
  }

  const eliminarTarea = async (id) => {
    await supabase.from('tareas').delete().eq('id', id)
    setTareas(prev => prev.filter(t => t.id !== id))
  }

  return { tareas, loading, crearTarea, completarTarea, eliminarTarea }
}