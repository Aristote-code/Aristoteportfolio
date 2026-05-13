export type VideoType = 'youtube' | 'loom' | 'vimeo';

export interface ParsedVideo {
  videoType: VideoType;
  videoId: string;
  embedUrl: string;
  thumbnailUrl?: string;
}

export function parseVideoUrl(raw: string): ParsedVideo | null {
  const url = raw.trim();

  // YouTube – watch?v=ID, youtu.be/ID, shorts/ID, embed/ID
  const ytPatterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/(?:shorts|embed)\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pat of ytPatterns) {
    const m = url.match(pat);
    if (m) {
      const id = m[1];
      return {
        videoType: 'youtube',
        videoId: id,
        embedUrl: `https://www.youtube.com/embed/${id}?rel=0`,
        thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      };
    }
  }

  // Loom – loom.com/share/ID or loom.com/embed/ID
  const loomMatch = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
  if (loomMatch) {
    const id = loomMatch[1];
    return {
      videoType: 'loom',
      videoId: id,
      embedUrl: `https://www.loom.com/embed/${id}`,
    };
  }

  // Vimeo – vimeo.com/ID or player.vimeo.com/video/ID
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    const id = vimeoMatch[1];
    return {
      videoType: 'vimeo',
      videoId: id,
      embedUrl: `https://player.vimeo.com/video/${id}?dnt=1`,
    };
  }

  return null;
}
