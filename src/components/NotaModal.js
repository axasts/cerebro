import React, { useState, useEffect } from 'react'

export default function NotaModal({ nota, areas, proyectos, onGuardar, onCerrar, bloqueado = false }) {
  const [titulo, setTitulo] = useState('')
  const [contenido, setContenido] = useState('')
  const [url, setUrl] = useState('')
  const [areaId, setAreaId] = useState('')
  const [proyectoId, setProyectoId] = useState('')
  const [etiquetasInput, setEtiquetasInput] = useState('')

  useEffect(() => {
    if (nota) {
      setTitulo(nota.titulo || '')
      setContenido(nota.contenido || '')
      setUrl(nota.url || '')
      setAreaId(nota.area_id || '')
      setProyectoId(nota.proyecto_id || '')
      setEtiquetasInput(nota.etiquetas?.join(', ') || '')
    }
  }, [nota])

  const proyectosFiltrados = areaId ? proyectos.filter(p => p.area_id === areaId) : proyectos

  const handleGuardar = () => {
    if (!titulo.trim()) return
    const etiquetas = etiquetasInput.split(',').map(t => t.trim()).filter(Boolean)
    onGuardar({
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      url: url.trim(),
      area_id: areaId || null,
      proyecto_id: proyectoId || null,
      etiquetas
    })
  }

  const inputStyle = {
    padding: '10px 14px',
    background: '#0f0f1a',
    border: '1px solid #2e2e4e',
    borderRadius: '8px',
    color: '#e8e8ff',
    fontSize: '13px',
    outline: 'none',
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
        width: '560px',
        maxWidth: '90vw',
        maxHeight: '85vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: '#e8e8ff' }}>
            {nota?.id ? 'Editar nota' : 'Nueva nota'}
          </h3>
          <button onClick={onCerrar} style={{ background: 'transparent', border: 'none', color: '#3a3a5a', cursor: 'pointer', fontSize: '20px' }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            style={inputStyle}
          />
          <textarea
            placeholder="Contenido..."
            value={contenido}
            onChange={e => setContenido(e.target.value)}
            rows={6}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
          />
          <input
            type="text"
            placeholder="URL (opcional)"
            value={url}
            onChange={e => setUrl(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Etiquetas (separadas por coma)"
            value={etiquetasInput}
            onChange={e => setEtiquetasInput(e.target.value)}
            style={inputStyle}
          />

          {!bloqueado && (
            <select value={areaId} onChange={e => { setAreaId(e.target.value); setProyectoId('') }} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Sin área</option>
              {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          )}

          {!bloqueado && areaId && (
            <select value={proyectoId} onChange={e => setProyectoId(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Sin proyecto</option>
              {proyectosFiltrados.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'flex-end' }}>
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
  )
}