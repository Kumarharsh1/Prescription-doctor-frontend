import { useRef } from 'react';

export default function UploadCard({ onAnalyze, loading, previewUrl }) {
  const inputRef = useRef(null);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (file) onAnalyze(file);
  };

  return (
    <div className="glass-card rounded-3xl p-8 shadow-xl shadow-indigo-500/5">
      <div className="flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-200 mb-4 animate-pulse-ring">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Upload a prescription
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-6 max-w-md">
          Select a clear photo of your prescription. Our AI will instantly
          detect and extract the medicines, dosages, frequency and
          instructions.
        </p>

        <label className="cursor-pointer">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="sr-only"
          />
          <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-300/50 hover:from-indigo-700 hover:to-cyan-700 transition-all">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            {loading ? 'Analyzing…' : 'Choose a prescription image'}
          </span>
        </label>

        {loading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-indigo-700">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Detecting text &amp; extracting medicines…
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="mt-6">
          <img
            src={previewUrl}
            alt="prescription preview"
            className="max-h-72 mx-auto rounded-2xl border border-slate-200 shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
