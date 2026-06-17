import { formatTime } from "@/lib/format";
import { messages as mockMessages } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { Message, ServiceResult } from "@/types";
import type { Database } from "@/types/database";

type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];

function mapMessage(row: MessageRow): Message {
  return {
    id: row.id,
    author: row.sender_id ? `User ${row.sender_id.slice(0, 8)}` : "Pactora user",
    role: "client",
    body: row.message,
    time: formatTime(row.created_at)
  };
}

export async function listMessages(projectId?: string): Promise<ServiceResult<Message[]>> {
  if (!supabase) {
    return { data: mockMessages, source: "mock" };
  }

  let query = supabase.from("messages").select("*").order("created_at", { ascending: true });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error || !data) {
    return { data: mockMessages, source: "mock" };
  }

  return { data: data.map(mapMessage), source: "supabase" };
}

export async function sendMessage(message: MessageInsert) {
  if (!supabase) {
    return { data: null, source: "mock" as const };
  }

  const { data, error } = await supabase.from("messages").insert([message]).select("*").single();

  if (error) {
    throw error;
  }

  return { data: mapMessage(data), source: "supabase" as const };
}
