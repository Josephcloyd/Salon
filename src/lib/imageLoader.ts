interface LoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

/**
 * next/image loader that lets the Unsplash CDN resize and pick AVIF/WebP.
 * Local images (starting with "/") are returned untouched.
 */
export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  if (src.startsWith("/")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 72));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  return url.toString();
}
