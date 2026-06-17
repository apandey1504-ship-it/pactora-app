"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { DashboardShell } from "@/components/DashboardShell";
import { MessageThread } from "@/components/MessageThread";
import { EmptyState, ErrorState, LoadingState } from "@/components/ResourceState";
import { useAuth } from "@/hooks/use-auth";
import { useMessages } from "@/hooks/use-messages";
import { useProjects } from "@/hooks/use-projects";
import { sendMessage, subscribeToProjectMessages } from "@/services/pactoraService";
import { Message } from "@/types";

export default function MessagesPage() {
  const { profile } = useAuth();
  const { data: projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();
  const { data: messages, source, loading, error, refetch } = useMessages(selectedProjectId);
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [sendError, setSendError] = useState<string | null>(null);
  const visibleMessages = useMemo(() => [...messages, ...liveMessages.filter((message) => !messages.some((item) => item.id === message.id))], [messages, liveMessages]);

  useEffect(() => {
    if (!selectedProjectId && projects[0]?.id) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    if (!selectedProjectId) {
      return;
    }

    setLiveMessages([]);
    const channel = subscribeToProjectMessages(selectedProjectId, (message) => {
      setLiveMessages((current) => [...current, message]);
    });

    return () => {
      channel?.unsubscribe();
    };
  }, [selectedProjectId]);

  async function handleSendMessage(message: string) {
    if (!selectedProjectId) {
      setSendError("Choose a project before sending a message.");
      return;
    }

    setSendError(null);

    try {
      await sendMessage({
        project_id: selectedProjectId,
        sender_id: profile?.id ?? "",
        message,
        message_type: "text"
      });
      await refetch();
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Message could not be sent.");
    }
  }

  return (
    <DashboardShell
      title="Messages"
      subtitle="Keep decision-making tied to projects, milestones, and scope changes."
      action={<div className="flex flex-wrap items-center gap-3"><DataSourceBadge source={source} loading={loading} /><button className="inline-flex items-center gap-2 rounded-lg bg-purple px-4 py-3 text-sm font-black text-white"><MessageSquare size={17} /> New thread</button></div>}
    >
      {error ? <div className="mb-6"><ErrorState message={`Supabase request failed: ${error}`} /></div> : null}
      {sendError ? <div className="mb-6"><ErrorState message={sendError} /></div> : null}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="px-2 pb-3 text-sm font-black uppercase tracking-wide text-slate-400">Projects</p>
          <div className="space-y-2">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className={`w-full rounded-lg px-3 py-3 text-left hover:bg-cloud ${selectedProjectId === project.id ? "bg-cloud" : ""}`}
              >
                <p className="font-black text-navy">{project.name}</p>
                <p className="text-sm font-semibold text-slate-500">{project.counterparty}</p>
              </button>
            ))}
          </div>
        </aside>
        <div>
          {loading ? <LoadingState /> : null}
          {!loading && visibleMessages.length === 0 ? <EmptyState message="No messages yet. Start the project thread." /> : null}
          <MessageThread messages={visibleMessages} onSend={handleSendMessage} disabled={!selectedProjectId} />
        </div>
      </div>
    </DashboardShell>
  );
}
