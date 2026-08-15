# Design review and the "Odlar" direction

Review of the marketing surface (`apps/web/app/about`, `app/page.tsx`, `landing.css`,
`globals.css`) and the replacement palette that was implemented off the back of it.

Reviewed 15 August 2026. Published proposal with rendered before/after comparisons:
<https://claude.ai/code/artifact/d2d4c110-f118-47ca-af71-8cd0940e1daa>

---

## Verdict

ALMAZ makes a technical claim: a tokenizer 4.6× more efficient on an agglutinative
language, validated on 38,139 native questions. The previous palette made that claim in
the visual language of a watch brand. `#C9A962` is a desaturated tan, and desaturation
reads as restraint, heritage and deference — the opposite of the argument the product is
actually making.

Three defects also meant the page never rendered as it was written. Those mattered more
than the palette, and are fixed here regardless of the colour decision.

---

## Bugs found

### 1. Every raised surface on the page was transparent

`landing.css` painted eight surfaces with `var(--charcoal)` and `var(--slate)`. Neither
variable was defined anywhere in the project — `globals.css` declared `--midnight-light`
and `--midnight-lighter` instead. An undefined custom property invalidates the whole
`background` declaration, so each one fell back to transparent.

The stats band, the data section, the footer, all twelve cards and every benchmark bar
track were rendering flat on `--midnight`. The alternating section rhythm and the
raised-card treatment the CSS described had never been visible.

**Fixed** by defining `--charcoal` and `--slate` — the names the stylesheet actually asks
for — rather than renaming eight call sites.

### 2. The schwa was in a fallback font

Every font loaded with `subsets: ['latin']`. Google's `latin` range stops at U+00FF and
does not include **ə** (U+0259), **ğ** (U+011F), **ş** (U+015F) or **İ** (U+0130); those
live in `latin-ext`.

So in *"Az**ə**rbaycan dilini d**ə**rind**ə**n"*, the schwas dropped out of Cormorant into
Georgia mid-word — different weight, different width, different shape. The page carries a
feature card boasting about rendering the ə correctly, set in a font that could not render
the ə.

**Fixed.** All three families now load `['latin', 'latin-ext']`. Verified in the built CSS:
the `u+0100-02ba` range ships for Fraunces, IBM Plex Sans and IBM Plex Mono.

### 3. The parallax handler was dead code that still ran on every scroll

`.hero-pattern` carries `animation: rotate-slow 120s linear infinite`, which animates
`transform`. A running CSS animation beats an inline style, so the scroll listener's
`transform` write was discarded every frame. The effect never appeared, while an
unthrottled listener and its `pageYOffset` read still fired on every scroll event.

**Fixed** by removing the listener and its ref.

---

## Craft issues addressed

- **The benchmark bars did not encode the benchmarks.** Widths were 95/88/92/85% against
  labels reading "≤2.2", "+10%", "≥85%" and "+8%" — different units, different directions,
  no shared scale, no zero. On a page whose argument is that ALMAZ was measured honestly,
  decorative bars dressed as data were the most expensive thing on it. The five discipline
  deltas now share one 0–20% axis with a marked baseline, and the four mixed-unit targets
  are stated as target values rather than drawn as comparable lengths.

- **Twelve emoji carried the iconography.** They rendered as whichever illustration set the
  visitor's OS shipped. Replaced with `components/Glyph.tsx`: fourteen marks built from the
  same lozenge as the carpet motif in the hero, monochrome, inheriting `currentColor`.

- **Six identical corpus cards flattened real magnitudes.** 651M words against 94M read as
  a tie. Sources with comparable word counts now carry a proportion bar against the largest.

- **A declared accent that did no work.** `--accent-teal` appeared twice, once at 0.05 alpha.
  Turquoise is now structural: eyebrows, links, baselines, focus rings.

- **Mobile had no navigation at all.** `.nav-links` was `display: none` below 1024px with
  nothing to replace it. Added a toggle, an opaque panel, and anchor links that close it.

- **Content flashed in, then hid.** The observer set `opacity: 0` after first paint. The
  hidden state now lives in CSS, the observer only reveals, and a `<noscript>` block keeps
  the page readable without JS. Added a `prefers-reduced-motion` guard — five infinite
  animations previously ran unconditionally.

- **No visible keyboard focus.** Added `:focus-visible` rings in turquoise.

---

## The palette

Not the flag, and not luxury. The colour comes from two things that are both Azerbaijani
and genuinely vivid: the dye box of a Quba carpet — madder, indigo ground, saffron — and
the flames of Yanar Dağ on dark rock. Indigo replaces the neutral near-black, so the ground
carries a hue rather than an absence of one.

Boldness is spent in one place. Flame is the accent and appears at display size, on rules
and on the single primary action. Saffron is reserved for measured figures, turquoise for
structure. Nothing else competes.

| Token | Hex | Role | Contrast on ground |
|---|---|---|---|
| `--midnight` | `#0B1030` | Ground — indigo, not neutral | — |
| `--charcoal` | `#101540` | Alternating section band | — |
| `--slate` | `#151B4A` | Raised card surface | — |
| `--line` | `#262E6B` | Hairlines and borders | — |
| `--gold` (flame) | `#FF4D2E` | Accent: display type, rules, primary action | 4.8:1 |
| `--saffron` | `#FFB627` | Every measured figure | 9.0:1 |
| `--accent-teal` | `#17D4E6` | Links, eyebrows, baselines, focus | 8.7:1 |
| `--silver` (mist) | `#B6BEE0` | Body copy | 8.4:1 |
| `--pearl` | `#F4F6FF` | Headings | 14.4:1 |
| `--muted` | `#7F88B8` | Captions and metadata | 4.9:1 |

Flame clears AA for normal text at 4.8:1, but it is kept off small body copy by convention —
it is an accent, not a text colour.

The `--gold` / `--silver` / `--pearl` names are retained as the accent / body / heading slots
so the roughly ninety existing references and the Tailwind theme re-skin without a rename
sweep. Semantic aliases (`--flame`, `--mist`, `--turquoise`) are defined for new code; a
follow-up can retire the old names.

## Typography

Chosen for coverage first. Each family draws the Azerbaijani diacritics with care, since
they appear in almost every word on the page.

| Role | Family | Weights | Used for |
|---|---|---|---|
| Display | Fraunces | variable | Headings |
| Body | IBM Plex Sans | 300–700 | All running text |
| Data | IBM Plex Mono | 400, 500 | Figures, eyebrows, captions |

All three load `['latin', 'latin-ext']`. Figures use `font-variant-numeric: tabular-nums`
so they line up in columns.

---

## Deliberately not done

**The tokenizer hero.** The strongest available move is to stop asserting "4.6×" in a row of
four numbers and instead split one real Azerbaijani word on screen — ALMAZ's morpheme tokens
against a generic model's byte shrapnel. It argues the claim instead of stating it, and puts
the ə, ş, ğ and ı at display size, which is the point of the project.

It is not built here because it needs a real endpoint. Publishing hand-authored token counts
on the page that argues you measured everything carefully would undo the argument. Build it
against the actual tokenizer, and if the true ratio on the chosen word isn't compelling,
choose a different word rather than a different number.

## Verification

- `next build` succeeds; `tsc --noEmit` is clean.
- `latin-ext` confirmed present in the built font CSS for all three families.
- Computed values spot-checked in a headless browser: corpus bars resolve to 100% / 27.6% /
  14.4% (651M / 180M / 94M), benchmark fills to 60/70/55/75/65% against the 20% axis.
- Mobile menu opens, navigates and closes; no horizontal overflow at 390px.
