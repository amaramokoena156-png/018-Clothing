import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  Trash2,
  Star,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { ProductImage } from '../types';
import { compressImageFile, formatFileSize } from '../lib/imageCompressor';

interface ProductImageUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  productName?: string;
  idPrefix?: string;
}

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  images,
  onChange,
  productName = 'Product',
  idPrefix = 'upload',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUploadStats, setLastUploadStats] = useState<{
    originalSize: number;
    compressedSize: number;
    count: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileArray.length === 0) {
      setErrorMessage('Please select valid image files (JPG, PNG, WEBP).');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    let totalOrig = 0;
    let totalComp = 0;

    try {
      const newProductImages: ProductImage[] = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setProcessingStatus(`Optimizing image ${i + 1} of ${fileArray.length} (${file.name})...`);

        const result = await compressImageFile(file, 1200, 0.85);
        totalOrig += result.originalSize;
        totalComp += result.compressedSize;

        newProductImages.push({
          id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          url: result.dataUrl,
          altText: `${productName} photo ${images.length + newProductImages.length + 1}`,
          isPrimary: images.length === 0 && newProductImages.length === 0,
        });
      }

      setLastUploadStats({
        originalSize: totalOrig,
        compressedSize: totalComp,
        count: fileArray.length,
      });

      const updated = [...images, ...newProductImages];
      // Ensure at least one image is marked as primary
      if (!updated.some((img) => img.isPrimary) && updated.length > 0) {
        updated[0].isPrimary = true;
      }

      onChange(updated);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error optimizing local image';
      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
      setProcessingStatus(null);
      // Reset inputs so user can upload the same file again if desired
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSetPrimary = (indexToSet: number) => {
    const updated = images.map((img, idx) => ({
      ...img,
      isPrimary: idx === indexToSet,
    }));
    onChange(updated);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange(updated);
  };

  return (
    <div id={`${idPrefix}-uploader-container`} className="space-y-4">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        id={`${idPrefix}-file-input`}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
          }
        }}
      />
      <input
        ref={cameraInputRef}
        id={`${idPrefix}-camera-input`}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
          }
        }}
      />

      {/* Main Drag & Drop / Click Zone */}
      <div
        id={`${idPrefix}-dropzone`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[#f35d1f] bg-orange-500/10'
            : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/30 hover:border-[#f35d1f]/70 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
        } ${isProcessing ? 'pointer-events-none opacity-80' : ''}`}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <Loader2 className="w-8 h-8 text-[#f35d1f] animate-spin" />
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              {processingStatus || 'Optimizing device photos...'}
            </p>
            <span className="text-[11px] text-neutral-500">
              Compressing resolution for instant loading and mobile performance.
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-3 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-[#f35d1f] flex items-center justify-center shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                Upload from your phone or computer
              </p>
              <p className="text-xs text-neutral-500">
                Drag and drop image files here, or tap to choose from your gallery or files
              </p>
            </div>

            {/* Action Buttons for Mobile & Desktop */}
            <div
              className="flex flex-wrap items-center justify-center gap-2 pt-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                id={`${idPrefix}-btn-browse`}
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Browse Files</span>
              </button>

              <button
                type="button"
                id={`${idPrefix}-btn-camera`}
                onClick={() => cameraInputRef.current?.click()}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <Camera className="w-4 h-4 text-[#f35d1f]" />
                <span>Take Photo (Camera)</span>
              </button>
            </div>

            <span className="text-[10px] text-neutral-400 font-mono">
              Supports JPEG, PNG, WEBP, HEIC from mobile or desktop
            </span>
          </div>
        )}
      </div>

      {/* Optimization Statistics Badge */}
      {lastUploadStats && (
        <div
          id={`${idPrefix}-optimization-badge`}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-xs"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="flex-1">
            <span className="font-bold">
              {lastUploadStats.count} photo{lastUploadStats.count > 1 ? 's' : ''} uploaded and optimized:{' '}
            </span>
            <span>
              {formatFileSize(lastUploadStats.originalSize)} reduced to{' '}
              {formatFileSize(lastUploadStats.compressedSize)} (fast mobile loading)
            </span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded Images Gallery Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Product Images ({images.length})
            </span>
            <span className="text-[11px] text-neutral-400">
              The primary image is shown first on catalog cards
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, idx) => {
              const isPrimary = img.isPrimary || idx === 0;
              return (
                <div
                  key={img.id || idx}
                  id={`${idPrefix}-img-card-${idx}`}
                  className={`relative group rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-neutral-100 dark:bg-neutral-800 ${
                    isPrimary
                      ? 'border-[#f35d1f] shadow-md ring-2 ring-[#f35d1f]/20'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  <div className="aspect-square w-full overflow-hidden bg-neutral-900/5">
                    <img
                      src={img.url}
                      alt={img.altText || `${productName} photo`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Primary Badge */}
                  {isPrimary ? (
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-[#f35d1f] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-white" />
                      <span>Cover Photo</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(idx)}
                      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 focus:opacity-100 px-2 py-1 rounded-md bg-black/70 hover:bg-[#f35d1f] text-white text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 transition-all"
                    >
                      <Star className="w-3 h-3" />
                      <span>Set as Cover</span>
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    title="Remove image"
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white shadow-sm transition-colors opacity-90 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Image details footer */}
                  <div className="p-2 text-[10px] text-neutral-500 dark:text-neutral-400 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs flex items-center justify-between">
                    <span className="font-mono">Photo {idx + 1}</span>
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className="text-[#f35d1f] hover:underline font-semibold"
                      >
                        Make Cover
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Quick Add More Tile */}
            <button
              type="button"
              id={`${idPrefix}-btn-add-more`}
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-[#f35d1f] bg-neutral-50/50 dark:bg-neutral-800/30 hover:bg-orange-500/5 flex flex-col items-center justify-center p-4 text-center text-neutral-500 dark:text-neutral-400 hover:text-[#f35d1f] transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-200 dark:bg-neutral-700/80 group-hover:bg-orange-100 flex items-center justify-center mb-1 text-neutral-700 dark:text-neutral-200">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider">Add More</span>
              <span className="text-[9px] text-neutral-400">Photos from device</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
