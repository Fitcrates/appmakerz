'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { urlFor } from '@/lib/sanity.image';
import { getImageAlt } from '@/lib/image-alt';
import { motion, AnimatePresence } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useImageLightbox, ZoomHint, type LightboxItem } from '@/components/media/ImageLightbox';

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

const slideTransition: Transition = {
  x: { type: 'spring', stiffness: 300, damping: 30 },
  opacity: { duration: 0.25 },
  scale: { duration: 0.3 },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function PortableTextGallery({ value }: PortableTextGalleryProps) {
  const { images = [], videoUrl, display = 'grid', columns = 2, aspectRatio = 'auto', zoom = true } = value;

  const params = useParams();
  const lang = (params?.lang as 'en' | 'pl') || 'pl';

  const galleryImageAlt = (image: GalleryImage, index: number, context: string) => getImageAlt(
    image,
    image.caption || `${context} ${index + 1}`,
  );

  /* ---- Carousel state ---- */
  const [activeIndex, setActiveIndex] = useState(0);
  const [[direction, sliding], setSliding] = useState([0, false]);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  /* ---- Lightbox: the same zoom as the project pages ---- */
  const lightboxItems = useMemo<LightboxItem[]>(
    () =>
      images.map((image, index) => ({
        fullSrc: urlFor(image).width(2400).auto('format').quality(85).fit('max').url(),
        alt: galleryImageAlt(image, index, 'Gallery image'),
        caption: image.caption,
      })),
    [images]
  );
  const { open: openZoom, isOpen: lightboxOpen, lightbox } = useImageLightbox(lightboxItems, lang);

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
    // Held while zoomed too: the slide must still be there for the zoom to
    // shrink back into.
    if (display !== 'carousel' || images.length <= 1 || isPaused || lightboxOpen) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [display, images.length, isPaused, lightboxOpen, goNext]);

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

  const openLightbox = (idx: number) => {
    if (zoom) openZoom(idx);
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
                  alt={galleryImageAlt(images[activeIndex], activeIndex, 'Gallery image')}
                  fill
                  className={`object-cover ${zoom ? 'cursor-zoom-in' : ''}`}
                  onClick={() => openLightbox(activeIndex)}
                  data-zoom-src={zoom ? lightboxItems[activeIndex]?.fullSrc : undefined}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                  priority={activeIndex === 0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Peek-ahead gradient overlays */}
            {images.length > 1 && (
              <>
                <div className="absolute inset-y-0 left-0 w-16 sm:w-24  z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-16 sm:w-24  z-10 pointer-events-none" />
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
              alt={galleryImageAlt(img, idx, 'Gallery image')}
              fill={aspectRatio !== 'auto'}
              width={aspectRatio === 'auto' ? 1200 : undefined}
              height={aspectRatio === 'auto' ? 900 : undefined}
              className={`object-cover ${aspectRatio === 'auto' ? 'w-full h-auto block' : ''} ${zoom ? 'cursor-zoom-in hover:scale-[1.01] transition-transform duration-500' : ''}`}
              onClick={() => openLightbox(idx)}
              data-zoom-src={zoom ? lightboxItems[idx]?.fullSrc : undefined}
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

  /* ================================================================ */
  /*  MAIN RETURN                                                      */
  /* ================================================================ */
  return (
    <>
      <div className="w-full">
        {renderMedia()}

        {/* Caption below the gallery telling the user they can click to zoom */}
        {zoom && images.length > 0 && <ZoomHint language={lang} className="-mt-2.5 mb-8" />}
      </div>

      {lightbox}
    </>
  );
}
