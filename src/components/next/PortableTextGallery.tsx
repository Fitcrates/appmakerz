'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface GalleryImage {
  _key: string;
  asset: { _ref: string };
  alt?: string;
  caption?: string;
}

export interface PortableTextGalleryProps {
  value: {
    images?: GalleryImage[];
    videoUrl?: string;
    display?: 'grid' | 'carousel';
    columns?: number;
    aspectRatio?: 'auto' | 'square' | '4/3' | '16/9' | '3/4';
    zoom?: boolean;
  };
}

export default function PortableTextGallery({ value }: PortableTextGalleryProps) {
  const { images = [], videoUrl, display = 'grid', columns = 2, aspectRatio = 'auto', zoom = true } = value;
  
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  // Close modal on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImageIndex(null);
      if (e.key === 'ArrowLeft' && selectedImageIndex !== null) handlePrev();
      if (e.key === 'ArrowRight' && selectedImageIndex !== null) handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  const handleNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case '4/3': return 'aspect-[4/3]';
      case '16/9': return 'aspect-video';
      case '3/4': return 'aspect-[3/4]';
      default: return '';
    }
  };

  const getGridColsClass = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2';
    }
  };

  const renderMedia = () => {
    if (videoUrl && !images.length) {
      // Basic support for rendering video if no images are present
      return (
        <div className={`w-full ${aspectRatio !== 'auto' ? getAspectRatioClass() : 'aspect-video'} bg-indigo-950/50 rounded-xl overflow-hidden border border-white/10 relative`}>
          <video 
            src={videoUrl} 
            controls 
            className="w-full h-full object-contain"
          />
        </div>
      );
    }

    if (!images.length) return null;

    if (display === 'carousel') {
      return (
        <div className="w-full overflow-hidden mb-8 group relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {images.map((img, idx) => (
              <div 
                key={img._key} 
                className={`flex-none w-[85%] sm:w-[60%] md:w-[45%] snap-center relative rounded-xl overflow-hidden border border-white/10 ${getAspectRatioClass()} ${aspectRatio === 'auto' ? 'min-h-[300px]' : ''}`}
              >
                <Image
                  src={urlFor(img).url()}
                  alt={img.alt || 'Gallery image'}
                  fill={aspectRatio !== 'auto'}
                  width={aspectRatio === 'auto' ? 800 : undefined}
                  height={aspectRatio === 'auto' ? 600 : undefined}
                  className={`object-cover ${aspectRatio === 'auto' ? 'w-full h-auto' : ''} ${zoom ? 'cursor-pointer hover:scale-105 transition-transform duration-500' : ''}`}
                  onClick={() => zoom && setSelectedImageIndex(idx)}
                />
                {zoom && (
                  <div className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                )}
                {img.caption && (
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-sm text-white/90">{img.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Grid Display
    return (
      <div className={`grid gap-4 mb-8 ${getGridColsClass()}`}>
        {images.map((img, idx) => (
          <div 
            key={img._key} 
            className={`relative group rounded-xl overflow-hidden border border-white/10 ${getAspectRatioClass()} ${aspectRatio === 'auto' ? 'h-full' : ''}`}
          >
            <Image
              src={urlFor(img).url()}
              alt={img.alt || 'Gallery image'}
              fill={aspectRatio !== 'auto'}
              width={aspectRatio === 'auto' ? 800 : undefined}
              height={aspectRatio === 'auto' ? 600 : undefined}
              className={`object-cover ${aspectRatio === 'auto' ? 'w-full h-auto block' : ''} ${zoom ? 'cursor-pointer hover:scale-105 transition-transform duration-500' : ''}`}
              onClick={() => zoom && setSelectedImageIndex(idx)}
            />
            {zoom && (
              <div className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            )}
            {img.caption && (
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm text-white/90">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {renderMedia()}
      
      {/* Zoom Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setSelectedImageIndex(null)}
          >
            <button 
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>

            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className={`absolute left-4 sm:left-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50 ${selectedImageIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                  disabled={selectedImageIndex === 0}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className={`absolute right-4 sm:right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50 ${selectedImageIndex === images.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                  disabled={selectedImageIndex === images.length - 1}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4 sm:mx-24 flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={urlFor(images[selectedImageIndex]).url()}
                  alt={images[selectedImageIndex].alt || 'Zoomed gallery image'}
                  fill
                  className="object-contain"
                  quality={100}
                />
              </div>
              
              {images[selectedImageIndex].caption && (
                <div className="absolute bottom-[-2rem] left-0 right-0 text-center">
                  <p className="text-white/80">{images[selectedImageIndex].caption}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
