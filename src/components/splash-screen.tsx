import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"video" | "splash">("video");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Called when the video finishes
  const handleVideoEnd = () => {
    console.log("Video ended fully ✅");
    setPhase("splash");
  };

  // Try playing once video is ready
  const handleCanPlay = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
      } catch (error) {
        console.error("Autoplay blocked or failed:", error);
        setPhase("splash"); // fallback
      }
    }
  };

  // Safety: only fallback after 30s if the video doesn’t end or fails
  useEffect(() => {
    const timer = setTimeout(() => {
      if (phase === "video") {
        console.warn("Video timeout fallback triggered ⏳");
        setPhase("splash");
      }
    }, 30000); // extended fallback time
    return () => clearTimeout(timer);
  }, [phase]);

  // Check video duration and set a timer to skip if it doesn't end naturally
  useEffect(() => {
    if (phase === "video" && videoRef.current) {
      const video = videoRef.current;
      const checkDuration = () => {
        if (video.duration && video.duration > 0) {
          const durationMs = video.duration * 1000;
          const timer = setTimeout(() => {
            if (phase === "video") {
              console.log("Video duration reached, moving to splash");
              setPhase("splash");
            }
          }, durationMs);
          return () => clearTimeout(timer);
        }
      };
      video.addEventListener('loadedmetadata', checkDuration);
      return () => video.removeEventListener('loadedmetadata', checkDuration);
    }
  }, [phase]);

  // After splash shows, go to main app
  useEffect(() => {
    if (phase === "splash") {
      const timer = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        {phase === "video" ? (
          <motion.video
            key="intro-video"
            ref={videoRef}
            autoPlay
            playsInline
            muted
            preload="auto"
            className="w-full h-full object-cover"
            onEnded={handleVideoEnd}
            onCanPlay={handleCanPlay}
            onError={(e) => {
              console.error("Video failed to load:", e);
              setPhase("splash");
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <source src="/videos/IntroVideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </motion.video>
        ) : (
          <motion.div
            key="splash-screen"
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className="w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg"
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-white text-4xl font-bold">Medibell</span>
            </motion.div>

            <motion.div
              className="mt-4 flex gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
