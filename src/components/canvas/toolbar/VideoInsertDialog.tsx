import { useState, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Video, X, AlertCircle } from 'lucide-react';
import { parseVideoUrl, ParsedVideo } from '../../../utils/canvas/videoParser';

interface VideoInsertDialogProps {
  onInsert: (parsed: ParsedVideo, width: number, height: number) => void;
  children: React.ReactNode;
}

export function VideoInsertDialog({ onInsert, children }: VideoInsertDialogProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(360);
  const [parsed, setParsed] = useState<ParsedVideo | null>(null);
  const [error, setError] = useState('');

  const handleUrlChange = useCallback((val: string) => {
    setUrl(val);
    if (!val.trim()) { setParsed(null); setError(''); return; }
    const result = parseVideoUrl(val);
    if (result) { setParsed(result); setError(''); }
    else { setParsed(null); setError('Paste a YouTube, Loom, or Vimeo URL'); }
  }, []);

  const handleInsert = () => {
    if (!parsed) return;
    onInsert(parsed, width, height);
    setOpen(false);
    setUrl('');
    setParsed(null);
    setError('');
  };

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
    if (!o) { setUrl(''); setParsed(null); setError(''); }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            zIndex: 200,
          }}
        />
        <Dialog.Content
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            borderRadius: 16,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            padding: 28,
            width: 480,
            maxWidth: '95vw',
            zIndex: 201,
          }}
          onPointerDown={e => e.stopPropagation()}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ background: '#8774ff20', borderRadius: 8, padding: 6 }}>
                <Video size={18} color="#8774ff" />
              </div>
              <Dialog.Title style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Figtree', sans-serif" }}>
                Embed Video
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 6, color: '#8c8fa6' }}>
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#474747', fontFamily: "'Figtree', sans-serif", display: 'block', marginBottom: 6 }}>
                Video URL
              </label>
              <input
                type="text"
                placeholder="Paste YouTube, Loom, or Vimeo URL…"
                value={url}
                onChange={e => handleUrlChange(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: `1.5px solid ${error ? '#f472b6' : parsed ? '#4ade80' : '#e5e7f0'}`,
                  fontSize: 14,
                  fontFamily: "'Figtree', sans-serif",
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#1a1a2e',
                  transition: 'border-color 0.15s',
                }}
              />
              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, color: '#f472b6', fontSize: 12, fontFamily: "'Figtree', sans-serif" }}>
                  <AlertCircle size={13} />
                  {error}
                </div>
              )}
            </div>

            {/* Thumbnail preview */}
            {parsed?.thumbnailUrl && (
              <div style={{ borderRadius: 10, overflow: 'hidden', background: '#f8f9fc', aspectRatio: '16/9' }}>
                <img src={parsed.thumbnailUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            {parsed && !parsed.thumbnailUrl && (
              <div style={{
                borderRadius: 10,
                background: '#f8f9fc',
                padding: 16,
                textAlign: 'center',
                fontSize: 13,
                color: '#8c8fa6',
                fontFamily: "'Gaegu', cursive",
              }}>
                ✅ {parsed.videoType.charAt(0).toUpperCase() + parsed.videoType.slice(1)} video detected
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#8c8fa6', display: 'block', marginBottom: 4, fontFamily: "'Figtree', sans-serif" }}>Width (px)</label>
                <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} min={200} max={1920}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e7f0', fontSize: 14, fontFamily: "'Figtree', sans-serif", outline: 'none', boxSizing: 'border-box', color: '#1a1a2e' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#8c8fa6', display: 'block', marginBottom: 4, fontFamily: "'Figtree', sans-serif" }}>Height (px)</label>
                <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} min={150} max={1080}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e7f0', fontSize: 14, fontFamily: "'Figtree', sans-serif", outline: 'none', boxSizing: 'border-box', color: '#1a1a2e' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Dialog.Close asChild>
                <button style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: '1.5px solid #e5e7f0',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontFamily: "'Figtree', sans-serif",
                  color: '#474747',
                  fontWeight: 600,
                }}>
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleInsert}
                disabled={!parsed}
                style={{
                  padding: '10px 24px',
                  borderRadius: 10,
                  border: 'none',
                  background: parsed ? '#8774ff' : '#e5e7f0',
                  color: parsed ? 'white' : '#aaa',
                  cursor: parsed ? 'pointer' : 'not-allowed',
                  fontSize: 14,
                  fontFamily: "'Figtree', sans-serif",
                  fontWeight: 700,
                  transition: 'all 0.15s',
                }}
              >
                Embed Video
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
