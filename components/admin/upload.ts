/** Resizes an image in the browser (max 1600px wide, WebP) and uploads it to R2 through /admin/upload. */
export async function uploadImage(file: File, maxWidth = 1600): Promise<string> {
  if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) throw new Error('Use a JPG, PNG, WebP or AVIF image.');
  let blob: Blob = file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bmp.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const out = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.82));
    if (out && out.type === 'image/webp' && out.size < file.size) blob = out;
  } catch {
    /* fall back to the original file */
  }
  const body = new FormData();
  body.append('file', blob, file.name);
  body.append('name', file.name);
  const res = await fetch('/admin/upload', { method: 'POST', body });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? 'Upload failed.');
  return data.url;
}
