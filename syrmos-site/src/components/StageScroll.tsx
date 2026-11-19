import { useEffect, useRef, type ReactNode } from "react";

/** The diagram's frame: on a narrow screen it scrolls sideways, and it opens on the middle of the diagram. */
export function StageScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.scrollWidth > el.clientWidth) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);
  return (
    <div className="stage-scroll" ref={ref}>
      {children}
    </div>
  );
}
