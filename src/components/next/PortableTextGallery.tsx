'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { urlFor } from '@/lib/sanity.image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { translations } from '../../translations/translations';

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
  
  const params = useParams();
  const lang = (params?.lang as 'en' | 'pl') || 'pl';
  
  // Custom fallback text just in case translation fails
  const clickToZoomText = translations[lang]?.projects?.clickToZoom || (lang === 'pl' ? 'Kliknij, aby powiększyć' : 'Click to zoom');

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Close modal on escape & handle arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImageIndex(null);
      if (e.key === 'ArrowLeft' && selectedImageIndex !== null) handlePrev();
      if (e.key === 'ArrowRight' && selectedImageIndex !== null) handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  // Reset zoom when image changes
  useEffect(() => {
    setScale(1);
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

  const toggleZoom = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setScale(s => s === 1 ? 2.5 : 1);
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
      let embedUrl: string | null = null;
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoId = videoUrl.includes('youtu.be') 
          ? videoUrl.split('youtu.be/')[1]?.split('?')[0]
          : new URLSearchParams(videoUrl.split('?')[1]).get('v');
        if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (videoUrl.includes('vimeo.com')) {
        const videoId = videoUrl.split('vimeo.com/')[1]?.split('/')[0];
        if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }

      return (
        <div className={`w-full ${aspectRatio !== 'auto' ? getAspectRatioClass() : 'aspect-video'} bg-indigo-950/50 rounded-xl overflow-hidden border border-white/10 relative mb-8`}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title="Video Player"
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video 
              src={videoUrl} 
              controls 
              className="w-full h-full object-contain"
            />
          )}
        </div>
      );
    }

    if (!images.length) return null;

    if (display === 'carousel') {
      return (
        <div className="w-full overflow-hidden mb-8 group relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {images.map((img, idx) => {
              // Determine aspect ratio class for height-driven sizing
              let aspectClass = 'aspect-[16/10]';
              if (aspectRatio === 'square') aspectClass = 'aspect-square';
              else if (aspectRatio === '4/3') aspectClass = 'aspect-[4/3]';
              else if (aspectRatio === '16/9') aspectClass = 'aspect-video';
              else if (aspectRatio === '3/4') aspectClass = 'aspect-[3/4]';

              return (
                <div 
                  key={img._key} 
                  className={`flex-none snap-center relative rounded-xl overflow-hidden border border-white/10 h-[150px] sm:h-[250px] md:h-[350px] lg:h-[550px] ${aspectClass} group/card`}
                >
                  <Image
                    src={urlFor(img).url()}
                    alt={img.alt || 'Gallery image'}
                    fill
                    className={`object-cover ${zoom ? 'cursor-pointer hover:scale-[1.01] transition-transform duration-500' : ''}`}
                    onClick={() => zoom && setSelectedImageIndex(idx)}
                    sizes="(max-height: 550px) 100vh, 1200px"
                  />
                  {img.caption && (
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                      <p className="text-sm text-white/90 font-light">{img.caption}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Grid Display
    return (
      <div className={`grid gap-6 mb-8 ${getGridColsClass()}`}>
        {images.map((img, idx) => (
          <div 
            key={img._key} 
            className={`relative group rounded-xl overflow-hidden border border-white/10 ${getAspectRatioClass()} ${aspectRatio === 'auto' ? 'h-full' : ''} group/card`}
          >
            <Image
              src={urlFor(img).url()}
              alt={img.alt || 'Gallery image'}
              fill={aspectRatio !== 'auto'}
              width={aspectRatio === 'auto' ? 1200 : undefined}
              height={aspectRatio === 'auto' ? 900 : undefined}
              className={`object-cover ${aspectRatio === 'auto' ? 'w-full h-auto block' : ''} ${zoom ? 'cursor-pointer hover:scale-[1.01] transition-transform duration-500' : ''}`}
              onClick={() => zoom && setSelectedImageIndex(idx)}
            />
            {img.caption && (
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                <p className="text-sm text-white/90 font-light">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Dynamic drag boundaries calculation for scale > 1
  const dragBoundaries = {
    left: -((dimensions.width * scale - dimensions.width) / 2) - 80,
    right: ((dimensions.width * scale - dimensions.width) / 2) + 80,
    top: -((dimensions.height * scale - dimensions.height) / 2) - 80,
    bottom: ((dimensions.height * scale - dimensions.height) / 2) + 80,
  };

  return (
    <>
      <div className="w-full">
        {renderMedia()}
        
        {/* Caption below the gallery telling the user they can click to zoom */}
        {zoom && images.length > 0 && (
          <div className="w-full text-center mt-[-10px] mb-8 text-xs sm:text-sm text-white/40 flex items-center justify-center gap-1.5 font-light">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>{clickToZoomText}</span>
          </div>
        )}
      </div>
      
      {/* Zoom Modal inside React Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedImageIndex !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center select-none touch-none"
              onClick={() => setSelectedImageIndex(null)}
            >
              {/* Close and zoom controls at the top */}
              <div className="absolute top-6 right-6 flex items-center gap-3 z-[100000]">
                <button 
                  onClick={toggleZoom}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/10"
                  title={scale > 1 ? "Zoom Out" : "Zoom In"}
                >
                  {scale > 1 ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setSelectedImageIndex(null)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/10"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {images.length > 1 && scale === 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className={`absolute left-4 sm:left-8 p-3.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[100000] border border-white/5 ${selectedImageIndex === 0 ? 'opacity-20 cursor-not-allowed' : ''}`}
                    disabled={selectedImageIndex === 0}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className={`absolute right-4 sm:right-8 p-3.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[100000] border border-white/5 ${selectedImageIndex === images.length - 1 ? 'opacity-20 cursor-not-allowed' : ''}`}
                    disabled={selectedImageIndex === images.length - 1}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Drag constraints area for zoom pan */}
              <div 
                ref={constraintsRef} 
                className="w-full h-full flex items-center justify-center overflow-hidden p-4 sm:p-12"
              >
                <motion.div 
                  drag={scale > 1}
                  dragConstraints={dragBoundaries}
                  dragElastic={0.15}
                  dragMomentum={false}
                  animate={{ scale }}
                  transition={{ type: 'spring', damping: 30, stiffness: 250 }}
                  className={`relative w-full h-full max-w-5xl max-h-[85vh] ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
                  onClick={toggleZoom}
                >
                  <Image
                    src={urlFor(images[selectedImageIndex]).url()}
                    alt={images[selectedImageIndex].alt || 'Zoomed gallery image'}
                    fill
                    className="object-contain pointer-events-none"
                    quality={100}
                    priority
                  />
                </motion.div>
              </div>
              
              {images[selectedImageIndex].caption && scale === 1 && (
                <div className="absolute bottom-6 left-6 right-6 text-center z-[100000] pointer-events-none">
                  <p className="text-white/80 bg-black/60 inline-block px-4 py-2 rounded-lg backdrop-blur-md text-sm border border-white/10 font-light">
                    {images[selectedImageIndex].caption}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
