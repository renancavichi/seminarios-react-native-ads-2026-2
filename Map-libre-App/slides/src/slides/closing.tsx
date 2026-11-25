import { BookOpen, FileCode2, Globe, MapPinned, PartyPopper, Rocket, Smartphone } from "lucide-react";
import type { SlideDef } from "../deck/Deck";

export const closingSlides: SlideDef[] = [
  {
    section: "Fechamento",
    variant: "section",
    notes: "Resumo: MapLibre = motor livre; dados você escolhe; mesmo estilo em web e app; Expo + EAS para gerar o APK sem Android Studio.",
    Body: () => (
      <>
        <div className="num"><PartyPopper /></div>
        <h2>Obrigado! Perguntas?</h2>
        <div className="cols-2" style={{ maxWidth: "80%", marginTop: "1rem" }}>
          <ul className="clean links">
            <li><BookOpen /><b style={{ color: "#fff" }}>maplibre.org</b> — documentação e exemplos</li>
            <li><FileCode2 /><b style={{ color: "#fff" }}>maplibre.org/maplibre-style-spec</b></li>
            <li><MapPinned /><b style={{ color: "#fff" }}>openfreemap.org</b> — tiles vetoriais grátis</li>
          </ul>
          <ul className="clean links">
            <li><Smartphone /><b style={{ color: "#fff" }}>github.com/maplibre/maplibre-react-native</b></li>
            <li><Rocket /><b style={{ color: "#fff" }}>docs.expo.dev</b> — Expo e EAS Build</li>
            <li><Globe /><b style={{ color: "#fff" }}>openstreetmap.org</b> — contribua com os dados!</li>
          </ul>
        </div>
      </>
    ),
  },
];
