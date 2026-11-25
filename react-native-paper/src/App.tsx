import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Presentation } from './components/Presentation';
import { useHashRoute } from './hooks/useHashRoute';
import { Playground } from './pages/Playground';
import { slides } from './slides';
import { lightTheme } from './theme/paperThemes';

// No navegador não há notch nem barra de status: insets zerados, sem medição assíncrona.
const initialMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

// Lembra de qual slide o Playground foi aberto, para voltar ao mesmo ponto.
const RETURN_KEY = 'rnp-presentation:return-slide';
function readReturnSlide(): number {
  try {
    return Number(sessionStorage.getItem(RETURN_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}
function saveReturnSlide(slide: number) {
  try {
    sessionStorage.setItem(RETURN_KEY, String(slide));
  } catch {
    /* armazenamento indisponível: volta para o primeiro slide */
  }
}

export default function App() {
  const { route, navigate } = useHashRoute(slides.length);

  return (
    <SafeAreaProvider initialMetrics={initialMetrics}>
      {/* Provider raiz: hospeda o Portal (Dialog, Menu) na janela inteira.
          Cada moldura de celular aplica seu próprio tema com ThemeProvider. */}
      <PaperProvider theme={lightTheme}>
        <div className="app-root">
          {route.view === 'playground' ? (
            <Playground
              tab={route.tab}
              onTabChange={(tab) => navigate({ view: 'playground', tab })}
              onBack={() => navigate({ view: 'slides', slide: readReturnSlide() })}
            />
          ) : (
            <Presentation
              slides={slides}
              index={route.slide}
              onNavigate={(slide) => navigate({ view: 'slides', slide })}
              onPlayground={() => {
                saveReturnSlide(route.slide);
                navigate({ view: 'playground' });
              }}
            />
          )}
        </div>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
