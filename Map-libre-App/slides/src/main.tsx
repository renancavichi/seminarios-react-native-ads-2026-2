import { createRoot } from "react-dom/client";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/600.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.css";
import { Deck } from "./deck/Deck";
import { SLIDES } from "./slides";

createRoot(document.getElementById("root")!).render(<Deck slides={SLIDES} />);
