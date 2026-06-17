create policy "storage_documents_update_project_participants"
on storage.objects for update
using (
  bucket_id = 'pactora-documents'
  and (
    public.is_admin()
    or public.is_project_participant((storage.foldername(name))[1]::uuid)
  )
)
with check (
  bucket_id = 'pactora-documents'
  and (
    public.is_admin()
    or public.is_project_participant((storage.foldername(name))[1]::uuid)
  )
);

