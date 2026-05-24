import { Trash2, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1e293b] w-full max-w-md p-8 rounded-2xl shadow-2xl border border-slate-700 relative animate-in fade-in zoom-in duration-200">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/10 p-4 rounded-full">
            <Trash2 className="text-red-500 w-10 h-10" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-white mb-2">Delete {title}</h3>
          <p className="text-slate-400">
            Are you sure you want to delete this {title.toLowerCase()}? This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-xl bg-red-600/20 text-red-500 font-semibold border border-red-600/30 hover:bg-red-600 hover:text-white transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;