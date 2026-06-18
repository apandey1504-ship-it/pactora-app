"use client";

import { FormEvent, useState } from "react";
import { FileUp, FolderCheck } from "lucide-react";
import type { ProjectDocument } from "@/types";
import { uploadDocument } from "@/services/pactoraService";

const documentCategories = [
  "Contract",
  "Company details",
  "Project scope",
  "Bank verification",
  "Insurance",
  "Milestone evidence"
];

export function DocumentUploadPanel({
  projectId,
  uploadedBy,
  documents,
  onUploaded
}: {
  projectId: string;
  uploadedBy?: string | null;
  documents: ProjectDocument[];
  onUploaded?: () => Promise<void> | void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const file = form.get("file");
    const category = String(form.get("category") ?? "Document");

    if (!(file instanceof File) || !file.name) {
      setError("Choose a document to upload.");
      return;
    }

    if (!uploadedBy) {
      setError("Login is required before uploading documents.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await uploadDocument({
        projectId,
        uploadedBy,
        file,
        category
      });
      formElement.reset();
      await onUploaded?.();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : `${category} upload failed.`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-lg font-black text-navy">
            <FolderCheck size={20} />
            Document vault
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Upload contracts, company records, project details, insurance files, banking verification, and milestone evidence.
          </p>
        </div>
      </div>

      <form onSubmit={handleUpload} className="mt-5 grid gap-3 lg:grid-cols-[180px_minmax(0,1fr)_150px]">
        <select name="category" className="rounded-lg border border-slate-200 px-3 py-3 text-sm font-black text-navy outline-none focus:border-purple">
          {documentCategories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <input name="file" type="file" className="min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-600 outline-none focus:border-purple" />
        <button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple px-4 py-3 text-sm font-black text-white disabled:opacity-50">
          <FileUp size={17} /> {saving ? "Uploading" : "Upload"}
        </button>
      </form>
      {error ? <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p> : null}

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {documents.length === 0 ? (
          <p className="rounded-lg bg-cloud p-4 text-sm font-bold text-slate-500">No documents uploaded yet.</p>
        ) : null}
        {documents.map((document) => (
          <a key={document.id} href={document.fileUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-100 bg-cloud p-4 transition hover:border-purple">
            {document.category ? <p className="mb-2 text-xs font-black uppercase tracking-wide text-purple">{document.category}</p> : null}
            <p className="font-black text-navy">{document.name}</p>
            <p className="mt-2 text-sm font-semibold text-slate-500">{document.createdAt}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
