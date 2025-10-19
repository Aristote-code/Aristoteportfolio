import { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  className?: string;
  aspectRatio?: string;
}

export function ImageUpload({ 
  value, 
  onChange, 
  onRemove,
  label = 'Upload Image',
  className = '',
  aspectRatio = 'aspect-video'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload image to Supabase Storage
  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError('');

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      // Create unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const extension = file.name.split('.').pop();
      const filename = `project_${timestamp}_${randomString}.${extension}`;

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', filename);

      // Upload to Supabase Storage via Edge Function
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/upload-image`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.url) {
        onChange(data.url);
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  // Handle paste
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            uploadImage(file);
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className={className}>
      {label && (
        <label className="block font-['Gaegu'] text-[18px] text-[#474747] mb-3">
          {label}
        </label>
      )}

      {value ? (
        // Show uploaded image
        <div className="relative group">
          <div className={`${aspectRatio} rounded-lg overflow-hidden border-2 border-[#e5e7f0]`}>
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white text-[#474747] rounded-lg font-['Gaegu'] text-[14px] hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Change
            </button>
            {onRemove && (
              <button
                onClick={onRemove}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-['Gaegu'] text-[14px] hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        // Upload area
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            ${aspectRatio} rounded-lg border-2 border-dashed cursor-pointer
            transition-all
            ${dragActive 
              ? 'border-[#8774ff] bg-[#8774ff]/5' 
              : 'border-[#e5e7f0] hover:border-[#8774ff]/50 hover:bg-gray-50/50'
            }
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <div className="h-full flex flex-col items-center justify-center gap-3 px-6">
            {uploading ? (
              <>
                <div className="w-12 h-12 border-4 border-[#e5e7f0] border-t-[#8774ff] rounded-full animate-spin" />
                <p className="font-['Gaegu'] text-[16px] text-[#8c8fa6]">
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-[#8c8fa6]" />
                </div>
                <div className="text-center">
                  <p className="font-['Gaegu'] text-[16px] text-[#474747] mb-1">
                    Click to upload, drag & drop, or paste
                  </p>
                  <p className="font-['Gaegu'] text-[14px] text-[#8c8fa6]">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 font-['Gaegu'] text-[14px] text-red-500">
          {error}
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
