import { useState, useRef, useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

interface SlideToActionProps {
  onTaken: () => void;
  onNotTaken: () => void;
  medicineName: string;
}

export function SlideToAction({ onTaken, onNotTaken, medicineName }: SlideToActionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(0);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX - position);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current || !sliderRef.current || isCompleted) return;

    const containerWidth = containerRef.current.offsetWidth;
    const sliderWidth = sliderRef.current.offsetWidth;
    const maxPosition = containerWidth - sliderWidth;

    let newPosition = clientX - startX;
    newPosition = Math.max(0, Math.min(newPosition, maxPosition));

    setPosition(newPosition);
  };

  const handleEnd = () => {
    if (!containerRef.current || !sliderRef.current || isCompleted) return;
    
    setIsDragging(false);
    
    const containerWidth = containerRef.current.offsetWidth;
    const sliderWidth = sliderRef.current.offsetWidth;
    const maxPosition = containerWidth - sliderWidth;

    // Check if slid to the end (taken - right side) - must be 90% or more
    if (position >= maxPosition * 0.9) {
      setIsCompleted(true);
      setPosition(maxPosition);
      setTimeout(() => {
        handleTaken();
      }, 300);
    }
    // Check if slid to start (not taken - left side) - must be 10% or less
    else if (position <= maxPosition * 0.1) {
      setIsCompleted(true);
      setPosition(0);
      setTimeout(() => {
        handleNotTaken();
      }, 300);
    }
    // Reset to center if not completed
    else {
      setPosition(maxPosition / 2);
    }
  };

  const handleTaken = () => {
    onTaken();
  };

  const handleNotTaken = () => {
    onNotTaken();
  };

  useEffect(() => {
    // Set initial position to center
    if (containerRef.current && sliderRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const sliderWidth = sliderRef.current.offsetWidth;
      setPosition((containerWidth - sliderWidth) / 2);
    }
  }, []);

  // Prevent body scroll when component is mounted
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      style={{ touchAction: 'none' }}
    >
      <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl">
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Medicine Reminder</h3>
          <p className="text-base sm:text-lg text-violet-600 font-semibold">{medicineName}</p>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">Slide completely to mark your action</p>
        </div>

        {/* Slide Container */}
        <div
          ref={containerRef}
          className="relative h-16 sm:h-20 bg-gradient-to-r from-red-100 via-slate-100 to-emerald-100 rounded-full overflow-visible shadow-inner select-none"
          style={{ touchAction: 'none' }}
          onMouseMove={(e) => {
            e.preventDefault();
            handleMove(e.clientX);
          }}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchMove={(e) => {
            e.preventDefault();
            handleMove(e.touches[0].clientX);
          }}
          onTouchEnd={handleEnd}
        >
          {/* Not Taken Label */}
          <div className="absolute left-3 sm:left-6 top-0 h-full flex items-center pointer-events-none z-10">
            <div className="flex items-center gap-1 sm:gap-2 text-red-600">
              <X className="w-4 h-4 sm:w-6 sm:h-6" />
              <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">Not Taken</span>
            </div>
          </div>

          {/* Taken Label */}
          <div className="absolute right-3 sm:right-6 top-0 h-full flex items-center pointer-events-none z-10">
            <div className="flex items-center gap-1 sm:gap-2 text-emerald-600">
              <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">Taken</span>
              <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Slider */}
          <div
            ref={sliderRef}
            style={{ 
              transform: `translateX(${position}px)`,
              touchAction: 'none'
            }}
            className="absolute top-1 sm:top-2 h-14 w-14 sm:h-16 sm:w-16 bg-white rounded-full shadow-2xl cursor-grab active:cursor-grabbing flex items-center justify-center border-4 border-violet-400 transition-all duration-200 z-20"
            onMouseDown={(e) => {
              e.preventDefault();
              handleStart(e.clientX);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              handleStart(e.touches[0].clientX);
            }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-3 sm:mt-4">
          Slide completely left for "Not Taken" or completely right for "Taken"
        </p>
      </div>
    </div>
  );
}
