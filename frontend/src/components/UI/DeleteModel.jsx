
import { Trash2 } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl relative"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-main)' }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full" style={{ background: 'rgba(239,68,68,0.1)' }}>
            <Trash2 size={40} style={{ color: '#ef4444' }} />
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>
            Delete {title}
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Are you sure you want to delete this {title.toLowerCase()}? This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl font-semibold transition-colors"
            style={{ background: 'var(--input-bg)', color: 'var(--text-main)', border: '1px solid var(--border-main)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--input-bg)'}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all"
            style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#ef4444'; }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;