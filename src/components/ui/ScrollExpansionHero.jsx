import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const ScrollExpansionHero = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobileState, setIsMobileState] = useState(false);

  const sectionRef = useRef(null);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = () => {
      setTouchStartY(0);
    };

    const handleScroll = () => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] overflow-x-hidden"
    >
      {/* Splash / Loading Expand Layer (Fixed overlay) */}
      <motion.div
        className="fixed inset-0 z-40 w-full h-full flex flex-col items-center justify-center overflow-hidden"
        animate={{ opacity: showContent ? 0 : 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ pointerEvents: showContent ? 'none' : 'auto' }}
      >
        {/* Background Image Layer */}
        <motion.div
          className="absolute inset-0 z-0 h-full w-full"
          style={{ opacity: 1 - scrollProgress }}
        >
          <img
            src={bgImageSrc}
            alt="Background"
            className="w-screen h-screen object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/15" />
        </motion.div>

        {/* Expanding Video Container */}
        <div
          className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden"
          style={{
            width: `${mediaWidth}px`,
            height: `${mediaHeight}px`,
            maxWidth: '100vw',
            maxHeight: '100vh',
            boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.35)',
          }}
        >
          {mediaType === 'video' ? (
            <div className="relative w-full h-full pointer-events-none">
              <video
                src={mediaSrc}
                poster={posterSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover rounded-xl"
              />
              <motion.div
                className="absolute inset-0 bg-black/20"
                animate={{ opacity: 0.4 - scrollProgress * 0.3 }}
              />
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img src={mediaSrc} alt="" className="w-full h-full object-cover rounded-xl" />
            </div>
          )}

          {/* Subtitles inside the expanding video box */}
          <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center text-center z-20 px-4">
            {date && (
              <p
                className="text-lg md:text-xl text-blue-100 font-medium drop-shadow"
                style={{ transform: `translateX(-${textTranslateX}vw)`, transition: 'transform 0.1s ease-out' }}
              >
                {date}
              </p>
            )}
            {scrollToExpand && (
              <p
                className="text-blue-100 font-medium text-center text-sm md:text-base mt-1 drop-shadow animate-pulse"
                style={{ transform: `translateX(${textTranslateX}vw)`, transition: 'transform 0.1s ease-out' }}
              >
                {scrollToExpand}
              </p>
            )}
          </div>
        </div>

        {/* Splitted Title Text overlay */}
        <div
          className={`flex items-center justify-center text-center gap-2 w-full relative z-30 flex-col select-none ${
            textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
          }`}
          style={{ pointerEvents: 'none' }}
        >
          <motion.h2
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight"
            style={{ 
              transform: `translateX(-${textTranslateX}vw)`,
              transition: 'transform 0.1s ease-out',
              fontFamily: "var(--font-serif)",
              fontStyle: "italic"
            }}
          >
            {firstWord}
          </motion.h2>
          <motion.h2
            className="text-5xl md:text-7xl lg:text-8xl font-black text-center text-white tracking-tight"
            style={{ 
              transform: `translateX(${textTranslateX}vw)`,
              transition: 'transform 0.1s ease-out',
              fontFamily: "var(--font-serif)"
            }}
          >
            {restOfTitle}
          </motion.h2>
        </div>
      </motion.div>

      {/* Main Content (Revealed and overlayed at top in normal flow) */}
      <motion.div
        className="w-full relative"
        style={{ zIndex: mediaFullyExpanded ? 50 : 5 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollExpansionHero;
