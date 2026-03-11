import React from 'react'
import { useDroppable } from '@dnd-kit/core'

export default function CeldaCalendario({ id, onClick, children }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      style={{
        background: isOver ? '#1e1e3a' : '#1a1a2e',
        minHeight: '40px',
        borderTop: '1px solid #252545',
        cursor: 'pointer',
        padding: '2px',
        position: 'relative',
        transition: 'background 0.1s'
      }}
    >
      {children}
    </div>
  )
}