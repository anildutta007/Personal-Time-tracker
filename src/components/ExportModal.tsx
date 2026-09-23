import React, { useState } from 'react';
import { TimeEntry } from '../types/tracker';
import { generateCSV, generateSummaryReport } from '../utils/analytics';
import { X, Download, Copy, Check, FileSpreadsheet, RotateCcw, AlertTriangle } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: TimeEntry[];
  onResetData: () => void;
  onClearAll: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  entries,
  onResetData,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [showDangerZone, setShowDangerZone] = useState(false);

  const reportText = generateSummaryReport(entries);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadCSV = () => {
    const csv = generateCSV(entries);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chronos-productivity-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-xl p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Export & Share Reports</h3>
            <p className="text-xs text-neutral-500">
              Download CSV data or copy summary text for team standups
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center justify-center gap-2 p-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors font-medium text-xs shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download All Data (.CSV)</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 p-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl transition-colors font-medium text-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted Summary'}</span>
          </button>
        </div>

        {/* Live Preview of formatted report */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700">Preview Formatted Report:</label>
          <pre className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-[11px] font-mono text-neutral-800 max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
            {reportText}
          </pre>
        </div>

        {/* Data Reset / Clear Zone */}
        <div className="pt-3 border-t border-neutral-100">
          {!showDangerZone ? (
            <button
              onClick={() => setShowDangerZone(true)}
              className="text-xs text-neutral-500 hover:text-neutral-800 underline"
            >
              Data Management & Reset Options
            </button>
          ) : (
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Reset or Clear Local Data</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Your data is saved securely in your browser's local storage.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    if (window.confirm('Reset all activities and load sample data?')) {
                      onResetData();
                      onClose();
                    }
                  }}
                  className="px-2.5 py-1 text-xs bg-white border border-neutral-300 rounded font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Reload Sample Data
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Clear all logged time history? (This cannot be undone)')) {
                      onClearAll();
                      onClose();
                    }
                  }}
                  className="px-2.5 py-1 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded font-medium hover:bg-rose-100"
                >
                  Clear All History
                </button>
                <button
                  onClick={() => setShowDangerZone(false)}
                  className="px-2 py-1 text-xs text-neutral-500 hover:text-neutral-800 ml-auto"
                >
                  Hide
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
