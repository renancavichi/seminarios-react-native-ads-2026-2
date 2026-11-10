import { useCallback, useEffect, useReducer, useState } from "react";
import { slides } from "../data/slides";
type State = { index: number; step: number };
type Action =
  { type: "next" | "previous" | "restart" } | { type: "go"; index: number };
const maxStep = (i: number) => (i === 6 ? 9 : i === 13 ? 6 : 0);
function parseHash() {
  const n = Number(window.location.hash.replace(/^#(?:slide-)?/, ""));
  return Number.isInteger(n) && n >= 1 && n <= slides.length ? n - 1 : 0;
}
function reducer(s: State, a: Action): State {
  if (a.type === "go")
    return {
      index: Math.max(0, Math.min(slides.length - 1, a.index)),
      step: 0,
    };
  if (a.type === "restart") return { ...s, step: 0 };
  if (a.type === "next")
    return s.step < maxStep(s.index)
      ? { ...s, step: s.step + 1 }
      : s.index < slides.length - 1
        ? { index: s.index + 1, step: 0 }
        : s;
  return s.step > 0
    ? { ...s, step: s.step - 1 }
    : s.index > 0
      ? { index: s.index - 1, step: 0 }
      : s;
}
export function usePresentation() {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    index: parseHash(),
    step: 0,
  }));
  const [overlay, setOverlay] = useState<"notes" | "index" | "help" | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const next = useCallback(() => dispatch({ type: "next" }), []);
  const previous = useCallback(() => dispatch({ type: "previous" }), []);
  const go = useCallback((index: number) => {
    dispatch({ type: "go", index });
  }, []);
  const restart = useCallback(() => dispatch({ type: "restart" }), []);
  const fullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen)
        await document.documentElement.requestFullscreen();
      else
        setMessage(
          "Tela cheia indisponível. A apresentação continua funcionando nesta janela.",
        );
    } catch {
      setMessage(
        "O navegador não permitiu tela cheia. A apresentação continua funcionando nesta janela.",
      );
    }
  }, []);
  useEffect(() => {
    const hash = `#slide-${String(state.index + 1).padStart(2, "0")}`;
    if (location.hash !== hash) history.pushState(null, "", hash);
    document.title = `${String(state.index + 1).padStart(2, "0")} · ${slides[state.index].title} — Login Social`;
  }, [state.index]);
  useEffect(() => {
    const update = () => go(parseHash());
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, [go]);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [message]);
  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat)
        return;
      const target = event.target as HTMLElement;
      if (target.matches('input, textarea, select, [contenteditable="true"]'))
        return;
      const key = event.key.toLowerCase();
      if (key === "escape") {
        setOverlay(null);
        return;
      }
      if (key === "n") {
        event.preventDefault();
        setOverlay((o) => (o === "notes" ? null : "notes"));
        return;
      }
      if (key === "g") {
        event.preventDefault();
        setOverlay((o) => (o === "index" ? null : "index"));
        return;
      }
      if (key === "?" || key === "h") {
        event.preventDefault();
        setOverlay((o) => (o === "help" ? null : "help"));
        return;
      }
      if (key === "f") {
        event.preventDefault();
        void fullscreen();
        return;
      }
      if (overlay === "index" || overlay === "help") return;
      if (key === " " && target.closest("button,a")) return;
      if (["arrowright", " ", "pagedown"].includes(key)) {
        event.preventDefault();
        next();
      }
      if (["arrowleft", "pageup"].includes(key)) {
        event.preventDefault();
        previous();
      }
      if (key === "home") {
        event.preventDefault();
        go(0);
      }
      if (key === "end") {
        event.preventDefault();
        go(slides.length - 1);
      }
    }
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [next, previous, go, fullscreen, overlay]);
  return {
    ...state,
    overlay,
    setOverlay,
    next,
    previous,
    go,
    restart,
    fullscreen,
    message,
    maxStep: maxStep(state.index),
  };
}
