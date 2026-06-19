const ModalHeader = ({ title, onClose }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-main)' }}>
      <h2 className="text-xl font-semibold" style={{ color: 'var(--text-main)' }}>{title}</h2>
      <button
        onClick={onClose}
        style={{ background: 'var(--tab-inactive-bg)', color: 'var(--text-main)' }}
        className="h-9 w-9 rounded-full hover:opacity-80 flex items-center justify-center"
      >
        ✕
      </button>
    </div>
  );
};

export default ModalHeader;