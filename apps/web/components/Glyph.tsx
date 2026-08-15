/**
 * Geometric mark set for the ALMAZ site.
 *
 * Every mark is built from the same lozenge as the carpet motif rotating in the
 * hero, so the iconography belongs to one family instead of borrowing whichever
 * emoji set the visitor's OS happens to ship. Strokes inherit `currentColor`,
 * so a mark takes the accent of whatever surface it sits on.
 */

export type GlyphName =
  | 'corpus'
  | 'web'
  | 'archive'
  | 'literature'
  | 'legal'
  | 'specialized'
  | 'government'
  | 'enterprise'
  | 'education'
  | 'media'
  | 'health'
  | 'morphology'
  | 'speed'
  | 'domain'

const PATHS: Record<GlyphName, React.ReactNode> = {
  // Nested lozenges — the master mark, used for the primary corpus
  corpus: (
    <>
      <path d="M12 2 L22 12 L12 22 L2 12 Z" />
      <path d="M12 7 L17 12 L12 17 L7 12 Z" />
      <circle cx="12" cy="12" r="1.6" />
    </>
  ),
  // Lozenge crossed into a net
  web: (
    <>
      <path d="M12 2 L22 12 L12 22 L2 12 Z" />
      <path d="M2 12 H22" />
      <path d="M12 2 V22" />
    </>
  ),
  // Stacked records inside the lozenge
  archive: (
    <>
      <path d="M12 2 L22 12 L12 22 L2 12 Z" />
      <path d="M7.5 9 H16.5" />
      <path d="M5.5 12 H18.5" />
      <path d="M7.5 15 H16.5" />
    </>
  ),
  // Two half-lozenges opening from a spine
  literature: (
    <>
      <path d="M12 5.5 L4 12 L12 18.5" />
      <path d="M12 5.5 L20 12 L12 18.5" />
      <path d="M12 5.5 V18.5" />
    </>
  ),
  // Beam with two lozenge pans
  legal: (
    <>
      <path d="M12 3 V21" />
      <path d="M5 8 H19" />
      <path d="M5 10.5 L7.5 13 L5 15.5 L2.5 13 Z" />
      <path d="M19 10.5 L21.5 13 L19 15.5 L16.5 13 Z" />
    </>
  ),
  // Lozenge sighted on a centre
  specialized: (
    <>
      <path d="M12 2 L22 12 L12 22 L2 12 Z" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 5 V8" />
      <path d="M12 16 V19" />
      <path d="M5 12 H8" />
      <path d="M16 12 H19" />
    </>
  ),
  // Half-lozenge pediment over columns
  government: (
    <>
      <path d="M12 2.5 L21 11 H3 Z" />
      <path d="M7 11 V19" />
      <path d="M12 11 V19" />
      <path d="M17 11 V19" />
      <path d="M3.5 19 H20.5" />
    </>
  ),
  // Four lozenges on a grid
  enterprise: (
    <>
      <path d="M7.5 4 L11 7.5 L7.5 11 L4 7.5 Z" />
      <path d="M16.5 4 L20 7.5 L16.5 11 L13 7.5 Z" />
      <path d="M7.5 13 L11 16.5 L7.5 20 L4 16.5 Z" />
      <path d="M16.5 13 L20 16.5 L16.5 20 L13 16.5 Z" />
    </>
  ),
  // Flattened lozenge as a mortarboard, with tassel
  education: (
    <>
      <path d="M12 4 L22 9 L12 14 L2 9 Z" />
      <path d="M18.5 11.25 V16.5" />
      <path d="M6.5 11 V15 C6.5 15 9 17.5 12 17.5 C15 17.5 17.5 15 17.5 15 V11" />
    </>
  ),
  // Small lozenge broadcasting
  media: (
    <>
      <path d="M12 9 L15 12 L12 15 L9 12 Z" />
      <path d="M6 6 L8.5 8.5" />
      <path d="M18 6 L15.5 8.5" />
      <path d="M6 18 L8.5 15.5" />
      <path d="M18 18 L15.5 15.5" />
      <path d="M12 2 V5" />
      <path d="M12 19 V22" />
    </>
  ),
  // Two lozenges crossed into a cross
  health: (
    <>
      <path d="M12 2 L15 12 L12 22 L9 12 Z" />
      <path d="M2 12 L12 9 L22 12 L12 15 Z" />
    </>
  ),
  // A chain of morphemes
  morphology: (
    <>
      <path d="M5.5 8.6 L8.9 12 L5.5 15.4 L2.1 12 Z" />
      <path d="M12 8.6 L15.4 12 L12 15.4 L8.6 12 Z" />
      <path d="M18.5 8.6 L21.9 12 L18.5 15.4 L15.1 12 Z" />
    </>
  ),
  // Lozenge with a bolt
  speed: (
    <>
      <path d="M12 2 L22 12 L12 22 L2 12 Z" />
      <path d="M13.5 6.5 L9 12.5 H12 L10.5 17.5 L15 11.5 H12 Z" />
    </>
  ),
  // Layered strata
  domain: (
    <>
      <path d="M12 3 L19 8 L12 13 L5 8 Z" />
      <path d="M5 11.5 L12 16.5 L19 11.5" />
      <path d="M5 15.5 L12 20.5 L19 15.5" />
    </>
  ),
}

interface GlyphProps {
  name: GlyphName
  size?: number
  className?: string
}

export default function Glyph({ name, size = 24, className }: GlyphProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}
