function ConfidenceBar({ value }) {
  const pct = Math.round((value || 0) * 100);
  const color =
    pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded bg-slate-200 overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs w-10 text-right text-slate-500">{pct}%</span>
    </div>
  );
}

function Pill({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700',
    green: 'bg-green-100 text-green-800',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-800',
    teal: 'bg-teal-100 text-teal-800',
  };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function fieldLabel(type) {
  const map = {
    medicine_name: 'Medicine',
    dosage: 'Dosage',
    frequency: 'Frequency',
    instruction: 'Instruction',
    quantity: 'Quantity',
    time_indication: 'Time',
    medicine_field: 'Field (context)',
  };
  return map[type] || type;
}

function statusTone(item) {
  if (item.valid === false) return 'red';
  if (item.uncertain) return 'amber';
  return 'green';
}

export default function ResultPanel({ result }) {
  const {
    raw_detection_count,
    container_count,
    processed_detection_count,
    medicine_fields = [],
    grouped_medicines = {},
    prescription = [],
    needs_verification = [],
    original_filename,
    saved_file,
    ai_summary,
    ai_summary_success,
    ai_summary_error,
  } = result;

  return (
    <div className="space-y-6">
      {/* Header / summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold">Analysis Result</h2>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-slate-500">Raw detections</div>
            <div className="text-xl font-bold">{raw_detection_count}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-slate-500">Processed</div>
            <div className="text-xl font-bold">{processed_detection_count}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-slate-500">Medicine fields</div>
            <div className="text-xl font-bold">{container_count}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-slate-500">Needs check</div>
            <div className="text-xl font-bold text-amber-600">
              {needs_verification.length}
            </div>
          </div>
        </div>

        {original_filename && (
          <p className="mt-3 text-xs text-slate-400">
            File: {original_filename}
            {saved_file ? ` → saved as ${saved_file}` : ''}
          </p>
        )}

        {ai_summary_success && (
          <div className="mt-3 text-xs text-slate-400">
            <Pill tone="green">DB connected</Pill>
          </div>
        )}
      </div>

{/* AI Summary (Gemini) */}
      {ai_summary && (
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-semibold text-teal-800">
              AI Summary (Gemini)
            </h3>
            <Pill tone="teal">enhanced</Pill>
          </div>

          {ai_summary.patient_name && ai_summary.patient_name !== 'Unknown' && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-teal-700">Patient:</span>
              <span className="font-semibold text-teal-900">
                {ai_summary.patient_name}
              </span>
            </div>
          )}

          {Array.isArray(ai_summary.medicines) &&
          ai_summary.medicines.length > 0 ? (
            <div className="mt-3 space-y-3">
              {ai_summary.medicines.map((m, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white border border-teal-100 p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="font-semibold text-teal-900">
                      {m.name || 'Unknown'}
                    </div>
                    {m.uncertain ? (
                      <Pill tone="amber">uncertain</Pill>
                    ) : (
                      <Pill tone="green">ok</Pill>
                    )}
                  </div>

                  {(m.dosage || m.duration || m.frequency || m.instructions) &&
                    (m.dosage !== 'Unknown' ||
                      m.duration !== 'Unknown' ||
                      m.frequency !== 'Unknown' ||
                      m.instructions !== 'Unknown') && (
                      <ul className="mt-1 space-y-0.5 text-slate-600">
                        {m.dosage && m.dosage !== 'Unknown' && (
                          <li>Dosage: {m.dosage}</li>
                        )}
                        {m.duration && m.duration !== 'Unknown' && (
                          <li>Duration: {m.duration}</li>
                        )}
                        {m.frequency && m.frequency !== 'Unknown' && (
                          <li>Frequency: {m.frequency}</li>
                        )}
                        {m.instructions && m.instructions !== 'Unknown' && (
                          <li>Instructions: {m.instructions}</li>
                        )}
                      </ul>
                    )}

                  {Array.isArray(m.warnings) && m.warnings.length > 0 && (
                    <div className="mt-2 space-y-0.5">
                      {m.warnings.map((w, wi) => (
                        <p
                          key={wi}
                          className="text-xs text-amber-700 flex items-start gap-1"
                        >
                          <span>⚠</span>
                          <span>{w}</span>
                        </p>
                      ))}
                    </div>
                  )}

                  {m.original && m.original.ocr_text && (
                    <p className="mt-2 text-xs text-slate-400">
                      Original OCR: {m.original.ocr_text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-teal-700 mt-2">
              No medicines parsed by AI.
            </p>
          )}

          {Array.isArray(ai_summary.warnings) &&
            ai_summary.warnings.length > 0 && (
              <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                {(ai_summary.warnings || []).map((w, wi) => (
                  <p key={wi}>⚠ {w}</p>
                ))}
              </div>
            )}

          {ai_summary.notes && (
            <p className="mt-3 text-xs text-teal-700 italic">
              {ai_summary.notes}
            </p>
          )}
        </div>
      )}

      {ai_summary_success === false && ai_summary_error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <span className="font-semibold">AI summary unavailable: </span>
          {ai_summary_error}
        </div>
      )}

{/* Medicine fields (containers / context) */}
      {medicine_fields.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold mb-3">Detected Medicine Fields (context)</h3>
          <div className="space-y-2 text-sm">
            {medicine_fields.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
              >
                <span className="font-medium">#{f.id}</span>
                <span className="flex-1 mx-3 truncate">{f.text || '(no text)'}</span>
                <ConfidenceBar value={f.confidence} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prescription structured list */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold mb-3">Structured Prescription</h3>
        {prescription.length === 0 ? (
          <p className="text-sm text-slate-400">No structured detections.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2 pr-2">#</th>
                  <th className="py-2 pr-2">Field</th>
                  <th className="py-2 pr-2">Text</th>
                  <th className="py-2 pr-2">Confidence</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {prescription.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-2 pr-2 text-slate-400">{item.id}</td>
                    <td className="py-2 pr-2 font-medium">
                      {fieldLabel(item.type)}
                    </td>
                    <td className="py-2 pr-2 max-w-xs truncate">
                      {item.text || (
                        <span className="text-slate-300">—</span>
                      )}
                      {item.container_id ? (
                        <span className="text-xs text-slate-400 ml-1">
                          (field #{item.container_id})
                        </span>
                      ) : null}
                    </td>
                    <td className="py-2 pr-2 w-40">
                      <ConfidenceBar value={item.final_score} />
                    </td>
                    <td className="py-2">
                      <Pill tone={statusTone(item)}>
                        {item.valid === false
                          ? 'invalid'
                          : item.uncertain
                          ? 'uncertain'
                          : 'ok'}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grouped medicines */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold mb-3">Grouped Medicines</h3>
        {Object.keys(grouped_medicines).length === 0 ? (
          <p className="text-sm text-slate-400">No medicines grouped.</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(grouped_medicines).map(([key, entries]) => (
              <div
                key={key}
                className="rounded-lg bg-slate-50 p-3 text-sm"
              >
                <div className="font-medium text-slate-500 mb-1">
                  Container {key}
                </div>
                <ul className="space-y-1">
                  {entries.map((m) => (
                    <li key={m.id} className="flex items-center gap-2">
                      <span className="flex-1 truncate">{m.text || '(no text)'}</span>
                      <ConfidenceBar value={m.final_score} />
                      <Pill tone={m.uncertain ? 'amber' : 'green'}>
                        {m.uncertain ? '?' : 'ok'}
                      </Pill>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Needs verification */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold mb-3">Needs Verification</h3>
        {needs_verification.length === 0 ? (
          <p className="text-sm text-slate-400">
            None — all fields look confident.
          </p>
        ) : (
          <div className="space-y-2 text-sm">
            {needs_verification.map((item) => (
              <div
                key={item.id}
                className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    #{item.id} · {fieldLabel(item.type)}
                  </span>
                  <Pill tone="amber">
                    {Math.round((item.final_score || 0) * 100)}%
                  </Pill>
                </div>
                <p className="text-slate-700 mt-1">
                  {item.text || '(no text)'}
                  <span className="text-slate-400"> — {item.reason}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
