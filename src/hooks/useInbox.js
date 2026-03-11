import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function useInbox(userId) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) cargarItems()
  }, [userId])

  const cargarItems = async () => {
    const { data } = await supabase
      .from('inbox')
      .select('*')
      .eq('user_id', userId)
      .eq('procesado', false)
      .order('creado_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  const añadirItem = async (contenido, descripcion = '') => {
  const { data } = await supabase
    .from('inbox')
    .insert([{ contenido, descripcion, user_id: userId, procesado: false }])
    .select()
    .single()
  setItems(prev => [data, ...prev])
}

  const eliminarItem = async (id) => {
    await supabase.from('inbox').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const procesarItem = async (id) => {
    await supabase.from('inbox').update({ procesado: true }).eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return { items, loading, añadirItem, eliminarItem, procesarItem }
}