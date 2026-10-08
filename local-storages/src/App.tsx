import { useState, useCallback } from 'react';
import { PresentationHeader } from './components/PresentationHeader';
import { SlideIndicator } from './components/SlideIndicator';
import { HomeSlide } from './slides/HomeSlide';
import { MMKVSlide } from './slides/MMKVSlide';
import { ExpoSecureStoreSlide } from './slides/ExpoSecureStoreSlide';
import { StoragesAndZustandSlide } from './slides/StoragesAndZustandSlide';
import { BenchmarksSlide } from './slides/BenchmarksSlide';
import { ConclusionSlide } from './slides/ConclusionSlide';
import { ReferenciasSlide } from './slides/ReferenciasSlide';
import { ExpoSQLiteSlide } from './slides/ExpoSQLiteSlide';

const slides = [
  { id: 'home', title: 'Home', component: HomeSlide },
  { id: 'mmkv', title: 'MMKV', component: MMKVSlide },
  { id: 'expo-secure-store', title: 'Expo SecureStore', component: ExpoSecureStoreSlide },
  { id: 'expo-sqlite', title: 'Expo SQLite', component: ExpoSQLiteSlide },
  { id: 'storages-zustand', title: 'Storages & Zustand', component: StoragesAndZustandSlide },
  // { id: 'benchmarks', title: 'Benchmarks', component: BenchmarksSlide },
  { id: 'conclusion', title: 'Conclusão', component: ConclusionSlide },
  {id: 'referencias', title: 'Referências', component: ReferenciasSlide}
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (index === currentSlide || isTransitioning) return;
    setDirection(index > currentSlide ? 'forward' : 'back');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      window.scrollTo(0, 0); // Reset scroll position on slide change
      setIsTransitioning(false);
    }, 50);
  }, [currentSlide, isTransitioning]);

  const goNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    }
  }, [currentSlide, goToSlide]);

  const goPrev = useCallback(() => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, goToSlide]);

  const CurrentSlideComponent = slides[currentSlide].component;

  const enterClass = direction === 'forward' ? 'slide-transition-enter' : 'slide-transition-enter-back';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white flex flex-col overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-3xl" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-purple-600/5 blur-3xl" />
      </div>

      {/* Header */}
      <PresentationHeader
        currentSlide={currentSlide}
        totalSlides={slides.length}
        slideTitle={slides[currentSlide].title}
        onPrev={goPrev}
        onNext={goNext}
        canGoPrev={currentSlide > 0}
        canGoNext={currentSlide < slides.length - 1}
      />

      {/* Slide Indicator */}
      <SlideIndicator
        slides={slides}
        currentSlide={currentSlide}
        onSlideClick={goToSlide}
      />

      {/* Slide Content */}
      <main className="flex-1 relative overflow-y-auto">
        <div
          key={currentSlide}
          className={`${enterClass} min-h-full`}
        >
          <CurrentSlideComponent />
        </div>
      </main>

      {/* Keyboard navigation hint */}
      {/* <div className="fixed bottom-4 right-4 text-xs text-slate-500 hidden md:block">
        Use ← → para navegar
      </div> */}
    </div>
  );
}
