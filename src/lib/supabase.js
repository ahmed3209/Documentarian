import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Upload a file to a storage bucket, return the public URL
export async function uploadFile(bucket, path, file, contentType) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// Delete a file from storage by its public URL
export async function deleteFile(bucket, publicUrl) {
  try {
    const url = new URL(publicUrl);
    const pathParts = url.pathname.split(`/storage/v1/object/public/${bucket}/`);
    if (pathParts.length === 2) {
      await supabase.storage.from(bucket).remove([pathParts[1]]);
    }
  } catch {}
}
