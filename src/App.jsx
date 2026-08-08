import { useState } from 'react';
import UploadCard from './components/UploadCard';
import ResultPanel from './components/ResultPanel';

// API base URL. In production (Render static site) VITE_API_URL is the
// deployed backend URL, e.g. https://prescription-doctor-backend.onrender.com.
// In local dev it falls back to /api which Vite proxies to :8000.
const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const analyze = async (file) => {
    // Reset state
    setError(null);
    setResult(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);

    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Server error ${response.status}: ${text.slice(0, 300)}`
        );
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-cyan-50 text-slate-800">
      {/* Decorative background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-violet-300/30 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="bg-white/60 backdrop-blur-md border-b border-white/60 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-200">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  MediScan <span className="gradient-text">AI</span>
                </h1>
                <p className="text-xs text-slate-500 -mt-0.5">
                  Prescription Intelligence Assistant
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-green-700 text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Fast &amp; Secure
              </span>
            </div>
          </div>
        </header>

        {/* Hero */}
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 animate-fade-in-up">
            Decode Any Prescription in{' '}
            <span className="gradient-text">Seconds</span>
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto animate-fade-in-up animate-delay-100">
            Upload a photo of your prescription and our AI instantly extracts
            the medicines, dosages, frequency and instructions — cleanly and
            accurately.
          </p>
        </div>

        {/* Main content */}
        <main className="max-w-6xl mx-auto px-6 pb-10 space-y-8">
          <UploadCard
            onAnalyze={analyze}
            loading={loading}
            previewUrl={previewUrl}
          />

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 animate-fade-in-up">
              <p className="font-semibold">Analysis failed</p>
              <p className="text-sm break-words">{error}</p>
            </div>
          )}

          {result && <ResultPanel result={result} />}
        </main>

        {/* Footer */}
        <footer className="max-w-6xl mx-auto px-6 py-8 text-center text-xs text-slate-400">
          <p>
            MediScan AI — AI-powered prescription reading. Always verify with
            your doctor or pharmacist.
          </p>
        </footer>
      </div>
    </div>
  );
}
