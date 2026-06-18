'use client';

import { useState } from 'react';

interface SkippedReasonFormProps {
  actionId: string;
}

export default function SkippedReasonForm({ actionId }: SkippedReasonFormProps) {
  const [reason, setReason] = useState('');

  return (
    <div className="mt-6 border-t border-white/10 pt-5">
      <label htmlFor={`skip-reason-${actionId}`} className="block text-sm font-medium text-slate-300 mb-2">
        Why did you skip this action? (Optional)
      </label>
      <textarea
        id={`skip-reason-${actionId}`}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        className="w-full p-3 bg-slate-950/80 text-white placeholder-slate-500 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200"
        placeholder="e.g., It was raining all week."
      />
      <button
        className="mt-3 bg-white hover:bg-slate-100 text-slate-950 font-bold py-2.5 px-5 rounded-xl transition-all duration-200 shadow-sm"
        style={{ minHeight: '44px' }}
        aria-label="Submit reason for skipping"
      >
        Submit
      </button>
    </div>
  );
}
