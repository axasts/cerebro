import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function usePARA(userId) {
  const [areas, setAreas] = useState([])
  const [proyectos, setProyectos] = useState([])
  const [proyectosCerrados, setProyectosCerrados] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) cargarDatos()
  }, [userId])

  const cargarDatos = async () => {
    const [{ data: areasData }, { data: proyectosData }, { data: cerradosData }] = await Promise.all([
      supabase.from('areas').select('*').eq('user_id', userId).order('creado_at'),
      supabase.from('proyectos').select('*').eq('user_id', userId).eq('estado', 'activo').order('creado_at'),
      supabase.from('proyectos').select('*').eq('user_id', userId).eq('estado', 'cerrado').order('creado_at')
    ])
    setAreas(areasData || [])
    setProyectos(proyectosData || [])
    setProyectosCerrados(cerradosData || [])
    setLoading(false)
  }

  const crearArea = async (nombre, icono = '📁') => {
    const { data } = await supabase
      .from('areas')
      .insert([{ nombre, icono, user_id: userId }])
      .select()
      .single()
    setAreas(prev => [...prev, data])
    return data
  }

  const editarArea = async (id, nombre, icono) => {
    const { data } = await supabase
      .from('areas')
      .update({ nombre, icono })
      .eq('id', id)
      .select()
      .single()
    setAreas(prev => prev.map(a => a.id === id ? data : a))
  }

  const eliminarArea = async (id) => {
    await supabase.from('areas').delete().eq('id', id)
    setAreas(prev => prev.filter(a => a.id !== id))
    setProyectos(prev => prev.filter(p => p.area_id !== id))
  }

  const crearProyecto = async (nombre, areaId, descripcion = '', icono = '📋') => {
    const { data } = await supabase
      .from('proyectos')
      .insert([{ nombre, area_id: areaId, descripcion, icono, user_id: userId }])
      .select()
      .single()
    setProyectos(prev => [...prev, data])
    return data
  }

  const editarProyecto = async (id, nombre, icono) => {
    const { data } = await supabase
      .from('proyectos')
      .update({ nombre, icono })
      .eq('id', id)
      .select()
      .single()
    setProyectos(prev => prev.map(p => p.id === id ? data : p))
  }

  const eliminarProyecto = async (id) => {
    await supabase.from('proyectos').delete().eq('id', id)
    setProyectos(prev => prev.filter(p => p.id !== id))
    setProyectosCerrados(prev => prev.filter(p => p.id !== id))
  }

  const cerrarProyecto = async (id) => {
    const { data } = await supabase
      .from('proyectos')
      .update({ estado: 'cerrado' })
      .eq('id', id)
      .select()
      .single()
    setProyectos(prev => prev.filter(p => p.id !== id))
    setProyectosCerrados(prev => [...prev, data])
  }

  const reabrirProyecto = async (id) => {
    const { data } = await supabase
      .from('proyectos')
      .update({ estado: 'activo' })
      .eq('id', id)
      .select()
      .single()
    setProyectosCerrados(prev => prev.filter(p => p.id !== id))
    setProyectos(prev => [...prev, data])
  }

  const proyectosPorArea = (areaId) => proyectos.filter(p => p.area_id === areaId)
  const cerradosPorArea = (areaId) => proyectosCerrados.filter(p => p.area_id === areaId)

  return {
    areas, proyectos, proyectosCerrados, loading,
    crearArea, editarArea, eliminarArea,
    crearProyecto, editarProyecto, eliminarProyecto, cerrarProyecto, reabrirProyecto,
    proyectosPorArea, cerradosPorArea
  }
}