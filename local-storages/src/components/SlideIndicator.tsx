interface SlideIndicatorProps {
  slides: { id: string; title: string }[];
  currentSlide: number;
  onSlideClick: (index: number) => void;
}

export function SlideIndicator({ slides, currentSlide, onSlideClick }: SlideIndicatorProps) {
  return (
    <div className="relative z-40 bg-slate-950/50 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => onSlideClick(index)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap
                ${
                  index === currentSlide
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                    : index < currentSlide
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }
              `}
            >
              <span className={`
                w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                ${
                  index === currentSlide
                    ? 'bg-indigo-500 text-white'
                    : index < currentSlide
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-700/50 text-slate-400'
                }
              `}>
                {index < currentSlide ? '✓' : index + 1}
              </span>
              <span className="hidden sm:inline">{slide.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
