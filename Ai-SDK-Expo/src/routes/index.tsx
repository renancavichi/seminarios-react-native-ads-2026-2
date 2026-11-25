import { createFileRoute } from "@tanstack/react-router";
import { Deck } from "@/components/deck/Deck";
import { slides } from "@/components/deck/slides";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { slide?: number } => {
    const n = Number(s["slide"]);
    return Number.isFinite(n) && n >= 1 ? { slide: Math.min(Math.floor(n), slides.length) } : {};
  },
  head: () => ({
    meta: [
      { title: "AI SDK com Expo — Apresentação técnica" },
      { name: "description", content: "Apresentação interativa sobre AI SDK com Expo: streaming, API Routes, useChat, Tools e multi-step tool calls." },
      { property: "og:title", content: "AI SDK com Expo — Apresentação técnica" },
      { property: "og:description", content: "Slides com roteiro de fala sobre AI SDK com Expo, baseados na documentação oficial." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { slide } = Route.useSearch();
  return <Deck index={(slide ?? 1) - 1} />;
}
