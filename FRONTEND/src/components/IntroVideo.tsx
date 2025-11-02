import React, { useEffect, useRef, useState } from "react";

// ✅ Use Vite's correct asset reference syntax for video files
const mainVideo = new URL("../assets/Intro.mp4", import.meta.url).href;

interface IntroVideoProps {
  onEnd: () => void;
}

export default function IntroVideo({ onEnd }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnd = () => {
      setVideoEnded(true);
      onEnd(); // Trigger parent callback (hide video & show app)
    };

    video.addEventListener("ended", handleEnd);
    return () => video.removeEventListener("ended", handleEnd);
  }, [onEnd]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700 ${
        videoEnded ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        src={mainVideo}
        autoPlay
        muted
        playsInline
        onError={(e) => console.error("🎥 Video failed to load:", e)}
        onLoadedData={() => console.log("✅ Video loaded successfully")}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
