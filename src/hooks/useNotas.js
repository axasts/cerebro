import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function useNotas(userId) {
  const [notas, setNotas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) cargarNotas()
  }, [userId])

  const cargarNotas = async () => {
    const { data } = await supabase
      .from('notas')
      .select('*')
      .eq('user_id', userId)
      .order('creado_at', { ascending: false })
    setNotas(data || [])
    setLoading(false)
  }

  const crearNota = async (titulo, contenido, areaId = null, proyectoId = null, etiquetas = [], url = '') => {
    const { data } = await supabase
      .from('notas')
      .insert([{
        titulo,
        contenido,
        area_id: areaId || null,
        proyecto_id: proyectoId || null,
        etiquetas,
        url: url || null,
        user_id: userId
      }])
      .select()
      .single()
    setNotas(prev => [data, ...prev])
    return data
  }

  const editarNota = async (id, cambios) => {
    const { data } = await supabase
      .from('notas')
      .update(cambios)
      .eq('id', id)
      .select()
      .single()
    setNotas(prev => prev.map(n => n.id === id ? data : n))
  }

  const eliminarNota = async (id) => {
    await supabase.from('notas').delete().eq('id', id)
    setNotas(prev => prev.filter(n => n.id !== id))
  }

  const notasPorProyecto = (proyectoId) => notas.filter(n => n.proyecto_id === proyectoId)
  const notasPorArea = (areaId) => notas.filter(n => n.area_id === areaId && !n.proyecto_id)

  return { notas, loading, crearNota, editarNota, eliminarNota, notasPorProyecto, notasPorArea }
}