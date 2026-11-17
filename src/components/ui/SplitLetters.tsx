interface Segment {
  text: string;
  className?: string;
}

interface SplitLettersProps {
  segments: ReadonlyArray<Segment>;
}

/**
 * Splits text into masked letters for a slide-up reveal (`[data-letter]`).
 * Hidden from assistive tech: render the full sentence as sr-only alongside.
 */
export function SplitLetters({ segments }: SplitLettersProps) {
  const words = segments.flatMap((segment, si) =>
    segment.text
      .split(" ")
      .filter(Boolean)
      .map((word, wi) => ({ word, className: segment.className, key: `${si}-${wi}` })),
  );

  return (
    <span aria-hidden="true">
      {words.map(({ word, className, key }, index) => (
        <span key={key}>
          <span className={`inline-block overflow-hidden whitespace-nowrap pb-[0.14em] -mb-[0.14em] align-bottom ${className ?? ""}`}>
            {[...word].map((char, ci) => (
              <span key={ci} data-letter className="inline-block will-change-transform pr-[0.02em]">
                {char}
              </span>
            ))}
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
