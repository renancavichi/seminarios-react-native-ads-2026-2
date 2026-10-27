import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Topbar from './components/Topbar';
import { slides } from './data/slidesData';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const slide = slides[currentSlide];
  
  const PlaygroundComponent = slide.playground; 

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
      <Topbar />

      <main className="flex-1 flex pt-24 px-8 pb-8 gap-12 max-w-[1600px] mx-auto w-full h-[100vh]">
        
        <div className="flex-1 flex flex-col justify-center pr-8 relative">
          <div className="absolute top-1/2 -translate-y-1/2 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="mb-4">
            <span className="text-blue-500 font-mono text-sm tracking-wider font-semibold">
              SLIDE {currentSlide + 1} DE {slides.length}
            </span>
          </div>
          
          {slide.icon}
          
          <h1 className="text-5xl font-bold text-white mb-8 leading-tight tracking-tight">
            {slide.title}
          </h1>
          
          <div className="text-xl text-slate-300 leading-relaxed space-y-6">
            {slide.content.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-16 flex items-center space-x-4">
            <button 
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="p-4 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-30 border border-slate-700 cursor-pointer"
            >
              <ArrowLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center space-x-3 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              <span>Próximo</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-50" />
          
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-mono text-slate-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ambiente Interativo (Playground)</span>
            </h3>
          </div>

          <div className="flex-1 w-full">
            <PlaygroundComponent />
          </div>
        </div>

      </main>

      <div className="fixed bottom-0 left-0 h-1 bg-slate-800 w-full">
        <div 
          className="h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
}