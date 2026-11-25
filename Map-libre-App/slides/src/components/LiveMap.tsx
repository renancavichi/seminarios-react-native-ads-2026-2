import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import maplibregl from "maplibre-gl";

type Props = {
  options: Omit<maplibregl.MapOptions, "container">;
  /** Configuração extra; pode devolver uma função de limpeza. */
  setup?: (map: maplibregl.Map) => void | (() => void);
  badge?: ReactNode;
  controls?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
};

/**
 * Mapa MapLibre GL JS. É criado ao montar (quando o slide aparece) e
 * destruído ao desmontar — o navegador limita a quantidade de contextos WebGL.
 */
export function LiveMap({ options, setup, badge, controls = true, children, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: ref.current!,
      keyboard: false, // as setas do teclado navegam entre os slides
      attributionControl: { compact: true },
      maxPitch: 85,
      ...options,
    });
    if (controls) map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
    map.once("load", () => setLoading(false));
    const cleanup = setup?.(map);
    return () => {
      cleanup?.();
      map.remove();
    };
    // O mapa é criado uma única vez por slide.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="map" style={style}>
      <div ref={ref} className="map-canvas" />
      {loading && <div className="loading">Carregando mapa…</div>}
      {badge && <div className="badge">{badge}</div>}
      {children}
    </div>
  );
}
