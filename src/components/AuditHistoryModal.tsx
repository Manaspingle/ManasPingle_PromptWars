import React, { useEffect, useState } from 'react';
import { X, Clock, Trash2, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { getAuditHistory, deleteAuditFromHistory, SavedAuditItem } from '../services/history';

interface AuditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSelectAudit: (item: SavedAuditItem) => void;
}

export const AuditHistoryModal: React.FC<AuditHistoryModalProps> = ({
  isOpen,
  onClose,
  userId,
  onSelectAudit,
}) => {
  const [items, setItems] = useState<SavedAuditItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getAuditHistory(userId).then((list) => {
        setItems(list);
        setLoading(false);
      });
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteAuditFromHistory(userId, id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 id="history-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Saved Reasoning Audits
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Synced with Firebase Firestore & secure local storage
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close saved audits dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-xs text-slate-400">Loading your saved audits...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-10">
              <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No saved audits yet</p>
              <p className="text-xs text-slate-400 mt-1">
                When you audit a decision, it will appear here so you can review it anytime.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectAudit(item);
                  onClose();
                }}
                className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {item.decision}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {new Date(item.timestamp).toLocaleDateString()} at{' '}
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Delete from history"
                      aria-label={`Delete audit for ${item.decision}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ArrowUpRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Decisions remain private to your account</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
