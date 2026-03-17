import React, { useState } from 'react';
import { Upload, X, CheckCircle2, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
  accept?: string;
  currentValue?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onUploadSuccess, 
  label = "Upload File", 
  accept = "image/*,video/*",
  currentValue
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentValue || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        // Authentication is handled by cookies/session if applicable, 
        // or you might need to add headers if using tokens.
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setPreview(data.url);
      onUploadSuccess(data.url);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase font-bold tracking-widest text-brand-400">{label}</label>
      <div className="relative group">
        <div className={`
          border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-4
          ${uploading ? 'bg-brand-50 border-brand-200' : 'bg-white border-brand-100 hover:border-brand-300'}
          ${error ? 'border-red-200 bg-red-50' : ''}
        `}>
          {preview ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-brand-50">
              {preview.endsWith('.mp4') || preview.endsWith('.mov') ? (
                <video src={preview} className="w-full h-full object-contain" controls />
              ) : (
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              )}
              <button 
                onClick={() => {
                  setPreview(null);
                  onUploadSuccess('');
                }}
                className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="p-4 bg-brand-50 rounded-full text-brand-400 group-hover:scale-110 transition-transform">
                {uploading ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-brand-400 mt-1">Images or videos up to 50MB</p>
              </div>
            </>
          )}
          <input 
            type="file" 
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
        
        {error && (
          <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
            <X size={12} /> {error}
          </p>
        )}
        
        {preview && !uploading && (
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <CheckCircle2 size={12} /> File uploaded successfully
          </p>
        )}
      </div>
    </div>
  );
};
