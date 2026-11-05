'use client';

import { useActionState } from 'react';
import { updateLead, type SaveState } from '@/app/admin/actions';
import { leadStatuses } from '@/lib/admin-leads';

export function LeadForm({ id, status, notes }: { id: string; status: string; notes: string }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(updateLead, {});
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <fieldset>
        <legend className="mb-2 text-sm font-bold">Status</legend>
        <div className="flex flex-wrap gap-2">
          {leadStatuses.map((s) => (
            <label key={s.value} className="cursor-pointer">
              <input type="radio" name="status" value={s.value} defaultChecked={s.value === status} className="peer sr-only" />
              <span className="inline-block rounded-full border-[1.5px] border-line px-4 py-2 text-sm font-semibold transition-colors peer-checked:border-navy-900 peer-checked:bg-navy-900 peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-blue-500/30">
                {s.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="notes" className="mb-2 block text-sm font-bold">Internal notes</label>
        <textarea id="notes" name="notes" defaultValue={notes} maxLength={4000} rows={5} className="field" placeholder="Call outcome, quote sent, next follow-up date…" />
      </div>
      <div className="flex items-center gap-3">
        <button disabled={pending} className="btn btn-primary disabled:opacity-60">{pending ? 'Saving…' : 'Save'}</button>
        <p role="status" className={`text-sm font-semibold ${state.error ? 'text-red-700' : 'text-green-700'}`}>
          {state.error ?? (state.ok ? 'Saved' : '')}
        </p>
      </div>
    </form>
  );
}
