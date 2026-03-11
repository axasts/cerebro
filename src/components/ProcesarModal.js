import React, { useState } from 'react'

export default function ProcesarModal({ item, areas, proyectos, onConvertirTarea, onConvertirNota, onCerrar }) {
  const [tipo, setTipo] = useState('tarea')
  const [areaId, setAreaId] = useState('')
  const [proyectoId, setProyectoId] = useState('')
  const [prioridad, setPrioridad] = useState('normal')
  const [titulo, setTitulo] = useState(item.contenido)
  const [descripcion, setDescripcion] = useState(item.descripcion || '')
  const [fechaLimite, setFechaLimite] = useState('')
  const proyectosFiltrados = areaId ? proyectos.filter(p => p.area_id === areaId) : proyectos

  const handleGuardar = () => {
  if (!proyectoId && tipo === 'tarea') return
  const itemEditado = { ...item, contenido: titulo, descripcion }
  if (tipo === 'tarea') {
    onConvertirTarea(itemEditado, proyectoId, prioridad, fechaLimite || null)
  } else {
    onConvertirNota(itemEditado)
  }
}

  const inputStyle = {
    padding: '10px 14px',
    background: '#0f0f1a',
    border: '1px solid #2e2e4e',
    borderRadius: '8px',
    color: '#e8e8ff',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    width: '100%'
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
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: '#e8e8ff' }}>Procesar</h3>
          <button onClick={onCerrar} style={{ background: 'transparent', border: 'none', color: '#3a3a5a', cursor: 'pointer', fontSize: '20px' }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
  <input
    type="text"
    value={titulo}
    onChange={e => setTitulo(e.target.value)}
    placeholder="Título"
    style={inputStyle}
  />
  <textarea
    value={descripcion}
    onChange={e => setDescripcion(e.target.value)}
    placeholder="Descripción, links, contexto..."
    rows={3}
    style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
  />
</div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <button
            onClick={() => setTipo('tarea')}
            style={{
              flex: 1, padding: '10px',
              background: tipo === 'tarea' ? '#22204a' : 'transparent',
              border: `1px solid ${tipo === 'tarea' ? '#7c3aed' : '#2e2e4e'}`,
              borderRadius: '8px',
              color: tipo === 'tarea' ? '#a78bfa' : '#3a3a5a',
              cursor: 'pointer', fontSize: '13px',
              fontFamily: 'DM Sans, sans-serif'
            }}
          >
            Convertir en tarea
          </button>
          <button
            onClick={() => setTipo('nota')}
            style={{
              flex: 1, padding: '10px',
              background: tipo === 'nota' ? '#22204a' : 'transparent',
              border: `1px solid ${tipo === 'nota' ? '#7c3aed' : '#2e2e4e'}`,
              borderRadius: '8px',
              color: tipo === 'nota' ? '#a78bfa' : '#3a3a5a',
              cursor: 'pointer', fontSize: '13px',
              fontFamily: 'DM Sans, sans-serif'
            }}
          >
            Convertir en nota
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <select value={areaId} onChange={e => { setAreaId(e.target.value); setProyectoId('') }} style={inputStyle}>
            <option value="">Selecciona un área</option>
            {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>

          {areaId && (
            <select value={proyectoId} onChange={e => setProyectoId(e.target.value)} style={inputStyle}>
              <option value="">Sin proyecto</option>
              {proyectosFiltrados.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          )}

          {tipo === 'tarea' && (
            <>
              <select value={prioridad} onChange={e => setPrioridad(e.target.value)} style={inputStyle}>
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
            </>
          )}
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
            color: 'white', fontSize: '13px', cursor: 'pointer', fontWeight: '500',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            Procesar
          </button>
        </div>
      </div>
    </div>
  )
}