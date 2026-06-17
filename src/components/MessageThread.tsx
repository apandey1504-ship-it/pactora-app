"use client";

import { FormEvent, useState } from "react";
import { Message } from "@/types";

export function MessageThread({
  messages,
  onSend,
  disabled
}: {
  messages: Message[];
  onSend?: (message: string) => Promise<void> | void;
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.trim() || !onSend) {
      return;
    }

    setSending(true);
    await onSend(draft.trim());
    setDraft("");
    setSending(false);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="rounded-lg bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-black text-navy">{message.author}</p>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{message.role}</p>
              </div>
              <p className="text-sm font-semibold text-slate-500">{message.time}</p>
            </div>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-700">{message.body}</p>
          </div>
        ))}
      </div>
      <form className="mt-5 flex gap-3" onSubmit={handleSubmit}>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          disabled={disabled || sending}
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-purple focus:ring-4 focus:ring-purple/10"
          placeholder="Write a message"
        />
        <button disabled={disabled || sending} className="rounded-lg bg-purple px-5 py-3 text-sm font-black text-white disabled:opacity-50">
          {sending ? "Sending" : "Send"}
        </button>
      </form>
    </div>
  );
}
