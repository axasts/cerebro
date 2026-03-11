import React, { useState, useEffect } from 'react'
import usePARA from '../hooks/usePARA'
import { supabase } from '../lib/supabase'

export default function TareaModal({ session, onGuardar, onCerrar, proyectoIdInicial = null }) {
  const { areas, proyectos } = usePARA(session?.user?.id)
  const [titulo, setTitulo] = useState('')
  const [prioridad, setPrioridad] = useState('normal')
  const [fechaLimite, setFechaLimite] = useState('')
  const [areaId, setAreaId] = useState('')
  const [proyectoId, setProyectoId] = useState(proyectoIdInicial || '')
  const [descripcion, setDescripcion] = useState('')

  useEffect(() => {
    if (proyectoIdInicial && proyectos.length > 0) {
      const area = proyectos.find(p => p.id === proyectoIdInicial)?.area_id || ''
      setAreaId(area)
    }
  }, [proyectos, proyectoIdInicial])

  const proyectosFiltrados = areaId ? proyectos.filter(p => p.area_id === areaId) : proyectos

  const handleGuardar = async () => {
    if (!titulo.trim() || !proyectoId) return
    const { data } = await supabase
      .from('tareas')
      .insert([{
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || null,
        prioridad,
        fecha_limite: fechaLimite || null,
        proyecto_id: proyectoId,
        user_id: session?.user?.id
      }])
      .select()
      .single()
    onGuardar(data)
    onCerrar()
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    background: '#0f0f1a',
    border: '1px solid #2e2e4e',
    borderRadius: '8px',
    color: '#e8e8ff',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif'
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#16162a',
        border: '1px solid #22223a',
        borderRadius: '14px',
        padding: '32px',
        width: '480px',
        maxWidth: '90vw'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: '#e8e8ff' }}>Nueva tarea</h3>
          <button onClick={onCerrar} style={{ background: 'transparent', border: 'none', color: '#3a3a5a', cursor: 'pointer', fontSize: '20px' }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder="Título de la tarea"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            autoFocus
            style={inputStyle}
          />

          <select
            value={areaId}
            onChange={e => { setAreaId(e.target.value); setProyectoId('') }}
            style={inputStyle}
          >
            <option value="">Selecciona un área</option>
            {areas.map(a => <option key={a.id} value={a.id}>{a.icono} {a.nombre}</option>)}
          </select>

          {areaId && (
            <select
              value={proyectoId}
              onChange={e => setProyectoId(e.target.value)}
              style={inputStyle}
            >
              <option value="">Selecciona un proyecto</option>
              {proyectosFiltrados.map(p => <option key={p.id} value={p.id}>{p.icono} {p.nombre}</option>)}
            </select>
          )}

          <select
            value={prioridad}
            onChange={e => setPrioridad(e.target.value)}
            style={inputStyle}
          >
            <option value="alta">Prioridad alta</option>
            <option value="normal">Prioridad normal</option>
            <option value="baja">Prioridad baja</option>
          </select>

          <div>
            <label style={{ color: '#3a3a5a', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Fecha límite (opcional)</label>
            <input
              type="date"
              value={fechaLimite}
              onChange={e => setFechaLimite(e.target.value)}
              style={inputStyle}
            />
          </div>

          <textarea
            placeholder="Descripción (opcional)"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'flex-end' }}>
          <button onClick={onCerrar} style={{
            padding: '10px 20px', background: 'transparent',
            border: '1px solid #2e2e4e', borderRadius: '8px',
            color: '#3a3a5a', fontSize: '13px', cursor: 'pointer'
          }}>
            Cancelar
          </button>
          <button onClick={handleGuardar} style={{
            padding: '10px 20px', background: '#7c3aed',
            border: 'none', borderRadius: '8px',
            color: 'white', fontSize: '13px', cursor: 'pointer', fontWeight: '500'
          }}>
            Crear tarea
          </button>
        </div>
      </div>
    </div>
  )
}