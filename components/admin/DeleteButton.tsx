'use client';

export function DeleteButton({ action, id, label, confirmText, extra }: {
  action: (form: FormData) => Promise<void>; id: string; label: string; confirmText: string; extra?: Record<string, string>;
}) {
  return (
    <form action={action} onSubmit={(e) => { if (!confirm(confirmText)) e.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      {extra && Object.entries(extra).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <button className="btn w-full border-[1.5px] border-red-200 text-red-700 hover:bg-red-50">{label}</button>
    </form>
  );
}
