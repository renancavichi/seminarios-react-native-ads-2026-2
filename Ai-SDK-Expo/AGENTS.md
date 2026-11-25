<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Slide deck content lives in `src/components/deck/slides.tsx` (one entry per slide with on-slide content + speaker notes + minutes); code samples in `code.ts`. Why: single registry drives viewer, index, presenter view and duration estimate.
- Slides render at 1920x1080 inside `ScaledSlide` using `.slide-*` typography classes from `src/styles.css`. Why: one scaling/typography system for all views.
- Current slide is the `?slide=N` search param; presenter window syncs via BroadcastChannel "deck-sync". Why: refresh/share keeps position.
