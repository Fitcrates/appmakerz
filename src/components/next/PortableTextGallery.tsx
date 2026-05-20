'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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

/* ------------------------------------------------------------------ */
/*  Slide transition variants                                          */
/* ------------------------------------------------------------------ */
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '60%' : '-60%',
    opacity: 0,
    scale: 0.92,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-60%' : '60%',
    opacity: 0,
    scale: 0.92,
  }),
};

const slideTransition = {
  x: { type: 'spring', stiffness: 300, damping: 30 },
  opacity: { duration: 0.25 },
  scale: { duration: 0.3 },
};

/* ------------------------------------------------------------------ */
/*  Lightbox image transition variants                                 */
/* ------------------------------------------------------------------ */
const lightboxSlideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function PortableTextGallery({ value }: PortableTextGalleryProps) {
  const { images = [], videoUrl, display = 'grid', columns = 2, aspectRatio = 'auto', zoom = true } = value;

  const params = useParams();
  const lang = (params?.lang as 'en' | 'pl') || 'pl';

  const clickToZoomText = translations[lang]?.projects?.clickToZoom || (lang === 'pl' ? 'Kliknij, aby powiększyć' : 'Click to zoom');

  /* ---- Carousel state ---- */
  const [activeIndex, setActiveIndex] = useState(0);
  const [[direction, sliding], setSliding] = useState([0, false]);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  /* ---- Lightbox state ---- */
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [lightboxDirection, setLightboxDirection] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const constraintsRef = useRef<HTMLDivElement>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

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

  /* ---- Carousel navigation ---- */
  const goTo = useCallback(
    (index: number) => {
      if (sliding || index === activeIndex) return;
      const dir = index > activeIndex ? 1 : -1;
      setSliding([dir, true]);
      setActiveIndex(index);
      // Allow animation to settle
      setTimeout(() => setSliding(([d]) => [d, false]), 500);
    },
    [activeIndex, sliding],
  );

  const goNext = useCallback(() => {
    if (activeIndex < images.length - 1) goTo(activeIndex + 1);
    else goTo(0); // loop
  }, [activeIndex, images.length, goTo]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) goTo(activeIndex - 1);
    else goTo(images.length - 1); // loop
  }, [activeIndex, images.length, goTo]);

  /* ---- Autoplay ---- */
  useEffect(() => {
    if (display !== 'carousel' || images.length <= 1 || isPaused) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [display, images.length, isPaused, goNext]);

  /* ---- Keyboard navigation for carousel ---- */
  useEffect(() => {
    if (display !== 'carousel') return;

    const el = carouselRef.current;
    if (!el) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    };
    el.addEventListener('keydown', handleKey);
    return () => el.removeEventListener('keydown', handleKey);
  }, [display, goNext, goPrev]);

  /* ---- Lightbox keyboard & escape ---- */
  const handleLightboxPrev = useCallback(() => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setLightboxDirection(-1);
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  }, [selectedImageIndex]);

  const handleLightboxNext = useCallback(() => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setLightboxDirection(1);
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  }, [selectedImageIndex, images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImageIndex(null);
      if (e.key === 'ArrowLeft' && selectedImageIndex !== null) handleLightboxPrev();
      if (e.key === 'ArrowRight' && selectedImageIndex !== null) handleLightboxNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, handleLightboxPrev, handleLightboxNext]);

  useEffect(() => {
    setScale(1);
  }, [selectedImageIndex]);

  /* ---- Scroll active thumbnail into view ---- */
  useEffect(() => {
    if (selectedImageIndex === null || !thumbnailStripRef.current) return;
    const strip = thumbnailStripRef.current;
    const thumb = strip.children[selectedImageIndex] as HTMLElement | undefined;
    if (thumb) {
      thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedImageIndex]);

  const openLightbox = (idx: number) => {
    if (!zoom) return;
    setLightboxDirection(0);
    setSelectedImageIndex(idx);
  };

  const toggleZoom = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setScale(s => s === 1 ? 2.5 : 1);
  };

  /* ---- Helpers ---- */
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

  const getGridSizes = () => {
    switch (columns) {
      case 1: return '(max-width: 640px) 100vw, 800px';
      case 2: return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px';
      case 3: return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px';
      case 4: return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px';
      default: return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px';
    }
  };

  const carouselAspectClass = (() => {
    if (aspectRatio === 'square') return 'aspect-square';
    if (aspectRatio === '4/3') return 'aspect-[4/3]';
    if (aspectRatio === '16/9') return 'aspect-video';
    if (aspectRatio === '3/4') return 'aspect-[3/4]';
    return 'aspect-[16/10]';
  })();

  /* ================================================================ */
  /*  RENDER — Video                                                   */
  /* ================================================================ */
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

    /* ============================================================== */
    /*  CAROUSEL MODE                                                  */
    /* ============================================================== */
    if (display === 'carousel') {
      return (
        <div
          ref={carouselRef}
          tabIndex={0}
          className="w-full mb-8 outline-none group relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          aria-roledescription="carousel"
          aria-label="Image gallery"
        >
          {/* Slide counter */}
          <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70 text-xs font-light tracking-wide tabular-nums">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Main slide area */}
          <div className={`relative w-full ${carouselAspectClass} rounded-xl overflow-hidden border border-white/[0.08] bg-indigo-950/30`}>
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(_, info) => {
                  const swipeThreshold = 50;
                  if (info.offset.x < -swipeThreshold) goNext();
                  else if (info.offset.x > swipeThreshold) goPrev();
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <Image
                  src={urlFor(images[activeIndex]).width(1200).auto('format').quality(80).url()}
                  alt={images[activeIndex].alt || 'Gallery image'}
                  fill
                  className={`object-cover ${zoom ? 'cursor-pointer' : ''}`}
                  onClick={() => openLightbox(activeIndex)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                  priority={activeIndex === 0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Peek-ahead gradient overlays */}
            {images.length > 1 && (
              <>
                <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-indigo-950/50 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-indigo-950/50 to-transparent z-10 pointer-events-none" />
              </>
            )}

            {/* Caption overlay */}
            {images[activeIndex].caption && (
              <motion.div
                key={`caption-${activeIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"
              >
                <p className="text-sm sm:text-base text-white/90 font-light max-w-2xl">{images[activeIndex].caption}</p>
              </motion.div>
            )}

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md text-white/80 hover:text-white transition-all duration-300 border border-white/[0.08] hover:border-white/20 opacity-0 group-hover:opacity-100 sm:opacity-70 hover:scale-105"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md text-white/80 hover:text-white transition-all duration-300 border border-white/[0.08] hover:border-white/20 opacity-0 group-hover:opacity-100 sm:opacity-70 hover:scale-105"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Pagination dots */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-5" role="tablist" aria-label="Slide navigation">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  role="tab"
                  aria-selected={idx === activeIndex}
                  aria-label={`Go to slide ${idx + 1}`}
                  className="relative p-1 group/dot"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? 'w-7 h-2 bg-teal-300 shadow-[0_0_10px_rgba(94,234,212,0.4)]'
                        : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    /* ============================================================== */
    /*  GRID MODE                                                      */
    /* ============================================================== */
    return (
      <div className={`grid gap-6 mb-8 ${getGridColsClass()}`}>
        {images.map((img, idx) => (
          <div
            key={img._key}
            className={`relative group rounded-xl overflow-hidden border border-white/10 ${getAspectRatioClass()} ${aspectRatio === 'auto' ? 'h-full' : ''} group/card`}
          >
            <Image
              src={aspectRatio === 'auto' ? urlFor(img).width(1200).auto('format').quality(80).url() : urlFor(img).width(1200).auto('format').quality(80).url()}
              alt={img.alt || 'Gallery image'}
              fill={aspectRatio !== 'auto'}
              width={aspectRatio === 'auto' ? 1200 : undefined}
              height={aspectRatio === 'auto' ? 900 : undefined}
              className={`object-cover ${aspectRatio === 'auto' ? 'w-full h-auto block' : ''} ${zoom ? 'cursor-pointer hover:scale-[1.01] transition-transform duration-500' : ''}`}
              onClick={() => openLightbox(idx)}
              sizes={getGridSizes()}
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

  /* ---- Drag boundaries for lightbox zoom ---- */
  const dragBoundaries = {
    left: -((dimensions.width * scale - dimensions.width) / 2) - 80,
    right: ((dimensions.width * scale - dimensions.width) / 2) + 80,
    top: -((dimensions.height * scale - dimensions.height) / 2) - 80,
    bottom: ((dimensions.height * scale - dimensions.height) / 2) + 80,
  };

  /* ================================================================ */
  /*  MAIN RETURN                                                      */
  /* ================================================================ */
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

      {/* ============================================================ */}
      {/*  LIGHTBOX MODAL (React Portal)                                */}
      {/* ============================================================ */}
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
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-3 z-[100000]">
                <button
                  onClick={toggleZoom}
                  className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/10"
                  title={scale > 1 ? "Zoom Out" : "Zoom In"}
                >
                  {scale > 1 ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setSelectedImageIndex(null)}
                  className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/10"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation arrows */}
              {images.length > 1 && scale === 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleLightboxPrev(); }}
                    className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[100000] border border-white/5 ${selectedImageIndex === 0 ? 'opacity-20 cursor-not-allowed' : ''}`}
                    disabled={selectedImageIndex === 0}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleLightboxNext(); }}
                    className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[100000] border border-white/5 ${selectedImageIndex === images.length - 1 ? 'opacity-20 cursor-not-allowed' : ''}`}
                    disabled={selectedImageIndex === images.length - 1}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Main lightbox image with slide+fade transition */}
              <div
                ref={constraintsRef}
                className="w-full flex-1 flex items-center justify-center overflow-hidden p-4 sm:p-12"
              >
                <AnimatePresence initial={false} custom={lightboxDirection} mode="popLayout">
                  <motion.div
                    key={selectedImageIndex}
                    custom={lightboxDirection}
                    variants={lightboxSlideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    drag={scale > 1}
                    dragConstraints={dragBoundaries}
                    dragElastic={0.15}
                    dragMomentum={false}
                    style={{ scale }}
                    className={`relative w-full h-full max-w-5xl max-h-[75vh] ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
                    onClick={toggleZoom}
                  >
                    <Image
                      src={urlFor(images[selectedImageIndex]).width(1920).auto('format').quality(90).url()}
                      alt={images[selectedImageIndex].alt || 'Zoomed gallery image'}
                      fill
                      className="object-contain pointer-events-none"
                      priority
                      sizes="100vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Caption */}
              {images[selectedImageIndex].caption && scale === 1 && (
                <div className="absolute bottom-24 left-6 right-6 text-center z-[100000] pointer-events-none">
                  <p className="text-white/80 bg-black/60 inline-block px-4 py-2 rounded-lg backdrop-blur-md text-sm border border-white/10 font-light">
                    {images[selectedImageIndex].caption}
                  </p>
                </div>
              )}

              {/* Thumbnail strip */}
              {images.length > 1 && scale === 1 && (
                <div
                  className="absolute bottom-0 inset-x-0 z-[100000] bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-6 pb-4 px-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    ref={thumbnailStripRef}
                    className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-none max-w-3xl mx-auto pb-1"
                  >
                    {images.map((img, idx) => (
                      <button
                        key={img._key}
                        onClick={() => {
                          setLightboxDirection(idx > selectedImageIndex! ? 1 : -1);
                          setSelectedImageIndex(idx);
                        }}
                        className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                          idx === selectedImageIndex
                            ? 'border-teal-300 shadow-[0_0_12px_rgba(94,234,212,0.35)] scale-105'
                            : 'border-transparent opacity-50 hover:opacity-80 hover:border-white/20'
                        }`}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <Image
                          src={urlFor(img).width(120).height(120).auto('format').quality(60).fit('crop').url()}
                          alt={img.alt || `Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
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
