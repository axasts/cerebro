import React, { useState, useEffect } from 'react'

const sumar30min = (hora) => {
  const [h, m] = hora.split(':').map(Number)
  const total = h * 60 + m + 30
  const hh = Math.floor(total / 60) % 24
  const mm = total % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

export default function BloqueModal({ bloque, fecha, horaInicial, proyectos, tareas, onGuardar, onCerrar, onEliminar }) {
  const [titulo, setTitulo] = useState('')
  const [fechaBloque, setFechaBloque] = useState(fecha || '')
  const [horaInicio, setHoraInicio] = useState(horaInicial || '09:00')
  const [horaFin, setHoraFin] = useState(sumar30min(horaInicial || '09:00'))
  const [proyectoId, setProyectoId] = useState('')
  const [tareaId, setTareaId] = useState('')

  useEffect(() => {
    if (bloque) {
      setTitulo(bloque.titulo || '')
      setFechaBloque(bloque.fecha || fecha)
      setHoraInicio(bloque.hora_inicio || horaInicial || '09:00')
      setHoraFin(bloque.hora_fin || sumar30min(horaInicial || '09:00'))
      setProyectoId(bloque.proyecto_id || '')
      setTareaId(bloque.tarea_id || '')
    } else {
      setTitulo('')
      setFechaBloque(fecha || '')
      setHoraInicio(horaInicial || '09:00')
      setHoraFin(sumar30min(horaInicial || '09:00'))
      setProyectoId('')
      setTareaId('')
    }
  }, [bloque, fecha, horaInicial])

  const handleHoraInicio = (val) => {
    setHoraInicio(val)
    setHoraFin(sumar30min(val))
  }

  const tareasFiltradas = proyectoId ? tareas.filter(t => t.proyecto_id === proyectoId && !t.completada) : []

  const handleGuardar = () => {
    if (!titulo.trim()) return
    onGuardar({
      titulo: titulo.trim(),
      fecha: fechaBloque,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      proyecto_id: proyectoId || null,
      tarea_id: tareaId || null
    })
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

  const labelStyle = {
    color: '#6b6b8a',
    fontSize: '11px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '6px'
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
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: '#e8e8ff' }}>
            {bloque?.id ? 'Editar bloque' : 'Añadir al calendario'}
          </h3>
          <button onClick={onCerrar} style={{ background: 'transparent', border: 'none', color: '#3a3a5a', cursor: 'pointer', fontSize: '20px' }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder="Título del bloque"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            autoFocus
            style={inputStyle}
          />

          <div>
            <label style={labelStyle}>Fecha</label>
            <input type="date" value={fechaBloque} onChange={e => setFechaBloque(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Inicio</label>
              <input type="time" value={horaInicio} onChange={e => handleHoraInicio(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Fin</label>
              <input type="time" value={horaFin} onChange={e => setHoraFin(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <select value={proyectoId} onChange={e => { setProyectoId(e.target.value); setTareaId('') }} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="">Sin proyecto (bloque libre)</option>
            {proyectos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>

          {proyectoId && tareasFiltradas.length > 0 && (
            <select value={tareaId} onChange={e => setTareaId(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Sin tarea específica</option>
              {tareasFiltradas.map(t => <option key={t.id} value={t.id}>{t.titulo}</option>)}
            </select>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'space-between' }}>
          {bloque?.id && (
            <button onClick={() => onEliminar(bloque.id)} style={{
              padding: '10px 20px', background: '#2d1515',
              border: 'none', borderRadius: '8px',
              color: '#f87171', fontSize: '13px', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Eliminar
            </button>
          )}
          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            <button onClick={onCerrar} style={{
              padding: '10px 20px', background: 'transparent',
              border: '1px solid #2e2e4e', borderRadius: '8px',
              color: '#3a3a5a', fontSize: '13px', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Cancelar
            </button>
            <button onClick={handleGuardar} style={{
              padding: '10px 20px', background: '#7c3aed',
              border: 'none', borderRadius: '8px',
              color: 'white', fontSize: '13px', cursor: 'pointer',
              fontWeight: '500', fontFamily: 'DM Sans, sans-serif'
            }}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}