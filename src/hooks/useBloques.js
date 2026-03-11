import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function useBloques(userId) {
  const [bloques, setBloques] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) cargarBloques()
  }, [userId])

  const cargarBloques = async () => {
    const { data } = await supabase
      .from('bloques')
      .select('*')
      .eq('user_id', userId)
      .order('fecha')
    setBloques(data || [])
    setLoading(false)
  }

  const crearBloque = async (titulo, fecha, horaInicio, horaFin, tareaId = null, proyectoId = null) => {
    const { data } = await supabase
      .from('bloques')
      .insert([{
        titulo,
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        tarea_id: tareaId || null,
        proyecto_id: proyectoId || null,
        user_id: userId
      }])
      .select()
      .single()
    setBloques(prev => [...prev, data])
    return data
  }

  const editarBloque = async (id, cambios) => {
    const { data } = await supabase
      .from('bloques')
      .update(cambios)
      .eq('id', id)
      .select()
      .single()
    setBloques(prev => prev.map(b => b.id === id ? data : b))
  }

  const eliminarBloque = async (id) => {
    await supabase.from('bloques').delete().eq('id', id)
    setBloques(prev => prev.filter(b => b.id !== id))
  }

  const bloquesPorFecha = (fecha) => bloques.filter(b => b.fecha === fecha)

  return { bloques, loading, crearBloque, editarBloque, eliminarBloque, bloquesPorFecha }
}