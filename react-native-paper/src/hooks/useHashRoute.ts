import { useCallback, useEffect, useState } from 'react';

/**
 * Rotas baseadas no hash da URL — sobrevivem ao recarregar a página e
 * permitem compartilhar o link de um slide específico:
 *   #/slide/3        → terceiro slide
 *   #/playground     → Playground
 *   #/playground/form
 */
export type Route = { view: 'slides'; slide: number } | { view: 'playground'; tab?: string };

export function parseHash(hash: string, total: number): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts[0] === 'playground') return { view: 'playground', tab: parts[1] };
  const n = parts[0] === 'slide' ? Number.parseInt(parts[1] ?? '', 10) : NaN;
  const slide = Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), total - 1) : 0;
  return { view: 'slides', slide };
}

export function routeToHash(route: Route): string {
  if (route.view === 'playground') return route.tab ? `#/playground/${route.tab}` : '#/playground';
  return `#/slide/${route.slide + 1}`;
}

export function useHashRoute(total: number) {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash, total));

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash, total));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, [total]);

  const navigate = useCallback((next: Route) => {
    const hash = routeToHash(next);
    if (window.location.hash !== hash) window.location.hash = hash;
    setRoute(next);
  }, []);

  return { route, navigate };
}
