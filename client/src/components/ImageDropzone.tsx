import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Camera, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { SampleCase } from '../types';

interface ImageDropzoneProps {
  onImageSelected: (file: File | null, previewUrl?: string) => void;
  selectedPreview?: string | null;
  sampleCases?: SampleCase[];
  onSelectSample?: (sample: SampleCase) => void;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onImageSelected,
  selectedPreview,
  sampleCases = [],
  onSelectSample,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setErrorMessage(null);

    if (fileRejections && fileRejections.length > 0) {
      const rej = fileRejections[0];
      if (rej.errors?.[0]?.code === 'file-too-large') {
        setErrorMessage('File size exceeds the 10MB maximum limit.');
      } else {
        setErrorMessage('Please upload a valid image (JPEG, PNG, WebP, or HEIC).');
      }
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const previewUrl = URL.createObjectURL(file);
      onImageSelected(file, previewUrl);
    }
  }, [onImageSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelected(null, undefined);
    setErrorMessage(null);
  };

  // Browser Camera Snapshot feature
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access failed:', err);
      setErrorMessage('Could not access device camera. Please upload an image instead.');
      setIsCameraActive(false);
    }
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `field_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          const previewUrl = URL.createObjectURL(file);
          onImageSelected(file, previewUrl);
          stopCamera();
        }
      }, 'image/jpeg', 0.92);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-200">
          Crop / Leaf / Soil Specimen Image
          <span className="text-emerald-400 font-normal ml-1.5 text-xs">
            (Required for Multimodal AI Diagnosis)
          </span>
        </label>
        {!selectedPreview && !isCameraActive && (
          <button
            type="button"
            onClick={startCamera}
            className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Use Live Camera</span>
          </button>
        )}
      </div>

      {/* Camera Live Viewfinder Mode */}
      {isCameraActive && (
        <div className="relative rounded-2xl overflow-hidden border border-emerald-500/50 bg-black aspect-video max-h-80 flex flex-col items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 flex items-center gap-4">
            <button
              type="button"
              onClick={captureCameraFrame}
              className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-xl hover:bg-emerald-400 active:scale-95"
            >
              <Camera className="h-4 w-4" />
              Capture Photo
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="rounded-full bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Dropzone Area */}
      {!isCameraActive && (
        <div
          {...getRootProps()}
          className={`relative group rounded-2xl border-2 border-dashed p-6 transition-all cursor-pointer ${
            isDragActive
              ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
              : selectedPreview
              ? 'border-emerald-500/50 bg-slate-900/60'
              : 'border-slate-700/80 bg-slate-900/30 hover:border-emerald-500/40 hover:bg-slate-900/60'
          }`}
        >
          <input {...getInputProps()} />

          {selectedPreview ? (
            /* Selected Image Preview */
            <div className="relative flex flex-col sm:flex-row items-center gap-5">
              <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-lg">
                <img
                  src={selectedPreview}
                  alt="Crop Specimen"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 rounded-full bg-slate-950/80 p-1 text-slate-300 hover:text-white hover:bg-rose-500 transition-colors"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Specimen Image Attached
                </div>
                <p className="text-sm font-medium text-white">
                  Visual evidence ready for Gemini 2.5 Flash Multimodal analysis
                </p>
                <p className="text-xs text-slate-400">
                  Click or drag another image to replace current specimen.
                </p>
              </div>
            </div>
          ) : (
            /* Empty Drop State */
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all border border-slate-700/60">
                <UploadCloud className="h-7 w-7" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-200">
                <span className="text-emerald-400">Click to upload</span> or drag and drop leaf/crop photo
              </p>
              <p className="mt-1 text-xs text-slate-400">
                High-resolution JPEG, PNG, WebP or HEIC (Up to 10MB)
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
                <span>Leaves, Stems, Roots, Fruit, or Soil Samples</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error feedback */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Interactive Quick-Test Sample Presets */}
      {sampleCases && sampleCases.length > 0 && !selectedPreview && (
        <div className="pt-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Quick-Test Field Specimens (One-Click Presets):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {sampleCases.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => onSelectSample && onSelectSample(sample)}
                className="group relative flex items-center gap-2.5 rounded-xl border border-slate-800/90 bg-slate-900/60 p-2 text-left hover:border-emerald-500/40 hover:bg-slate-850 transition-all"
              >
                <img
                  src={sample.imageUrl}
                  alt={sample.title}
                  className="h-10 w-10 rounded-lg object-cover border border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                    {sample.cropType}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {sample.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
