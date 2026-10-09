import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { createUuid } from '../utils/ids';

const BUCKET = 'property-images';

export function usePropertyImages() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Upload un ou plusieurs fichiers et retourne leurs URLs publiques */
  async function uploadImages(files: FileList | File[], propertyId: string): Promise<string[]> {
    setUploading(true);
    setError(null);
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${propertyId}/${createUuid()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (uploadError) {
        setError(uploadError.message);
        continue;
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    setUploading(false);
    return urls;
  }

  async function deleteImage(path: string) {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) setError(error.message);
    return { error: error?.message ?? null };
  }

  return { uploadImages, deleteImage, uploading, error };
}
