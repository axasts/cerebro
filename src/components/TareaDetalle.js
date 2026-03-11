import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function TareaDetalle({ tarea, onCerrar, onActualizar }) {
  const [titulo, setTitulo] = useState(tarea.titulo)
  const [descripcion, setDescripcion] = useState(tarea.descripcion || '')
  const [prioridad, setPrioridad] = useState(tarea.prioridad || 'normal')
  const [fechaLimite, setFechaLimite] = useState(tarea.fecha_limite || '')
  const [guardando, setGuardando] = useState(false)

  const handleGuardar = async () => {
    setGuardando(true)
    const { data } = await supabase
      .from('tareas')
      .update({ titulo, descripcion, prioridad, fecha_limite: fechaLimite || null })
      .eq('id', tarea.id)
      .select()
      .single()
    onActualizar(data)
    setGuardando(false)
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
        width: '540px',
        maxWidth: '90vw'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: '#e8e8ff' }}>Detalles de la Tarea</h3>
          <button onClick={onCerrar} style={{ background: 'transparent', border: 'none', color: '#3a3a5a', cursor: 'pointer', fontSize: '20px' }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ color: '#6b6b8a', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Título</label>
            <input
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ color: '#6b6b8a', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Descripción</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder="Añade contexto, links, notas..."
              rows={6}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: '#6b6b8a', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Prioridad</label>
              <select value={prioridad} onChange={e => setPrioridad(e.target.value)} style={inputStyle}>
                <option value="alta">Alta</option>
                <option value="normal">Normal</option>
                <option value="baja">Baja</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: '#6b6b8a', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Fecha límite</label>
              <input
                type="date"
                value={fechaLimite}
                onChange={e => setFechaLimite(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'flex-end' }}>
          <button onClick={onCerrar} style={{
            padding: '10px 20px', background: 'transparent',
            border: '1px solid #2e2e4e', borderRadius: '8px',
            color: '#3a3a5a', fontSize: '13px', cursor: 'pointer'
          }}>
            Cancelar
          </button>
          <button onClick={handleGuardar} disabled={guardando} style={{
            padding: '10px 20px', background: '#7c3aed',
            border: 'none', borderRadius: '8px',
            color: 'white', fontSize: '13px', cursor: 'pointer', fontWeight: '500'
          }}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}