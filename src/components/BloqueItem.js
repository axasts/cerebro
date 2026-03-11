import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

export default function BloqueItem({ bloque, nombreProyecto, onClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: bloque.id
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      style={{
        background: '#2d1f5e',
        border: '1px solid #7c3aed',
        borderRadius: '6px',
        padding: '4px 8px',
        fontSize: '11px',
        color: '#e8e8ff',
        cursor: 'grab',
        opacity: isDragging ? 0.4 : 1,
        transform: CSS.Translate.toString(transform),
        touchAction: 'none',
        height: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bloque.titulo}</div>
      <div style={{ color: '#a78bfa', fontSize: '10px' }}>{bloque.hora_inicio.substring(0, 5)} - {bloque.hora_fin.substring(0, 5)}</div>
      {nombreProyecto && (
        <div style={{ color: '#5a5a8a', fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nombreProyecto}</div>
      )}
    </div>
  )
}