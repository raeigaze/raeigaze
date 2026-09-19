import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PIECES = [
  { img: '/sculptures/s1.jpg', title: 'Torso of a Witness', medium: 'Bronze, patinated — 2025', year: '01' },
  { img: '/sculptures/s2.jpg', title: 'Corridor Walk', medium: 'Travertine — 2024', year: '02' },
  { img: '/sculptures/s3.jpg', title: 'Untitled (Hands)', medium: 'Oxidised steel — 2026', year: '03' },
  { img: '/sculptures/s4.jpg', title: 'Nocturne in Ink', medium: 'Cast ink — 2023', year: '04' },
  { img: '/sculptures/s5.jpg', title: 'Library Figure', medium: 'Limestone — 2025', year: '05' },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const dist = () => Math.max(track.scrollWidth - window.innerWidth, 0);

      itemRefs.current.forEach((el) => {
        if (el) gsap.set(el, { autoAlpha: 0, y: 90, rotate: 2 });
      });

      const revealed = PIECES.map(() => false);
      const reveal = (i: number) => {
        if (revealed[i]) return;
        revealed[i] = true;
        const el = itemRefs.current[i];
        if (!el) return;
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          rotate: 0,
          duration: 1.2,
          ease: 'power3.out',
        });
      };

      gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            PIECES.forEach((_, i) => {
              if (p >= i / PIECES.length - 0.001) reveal(i);
            });
          },
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      <div className="overflow-hidden">
        <div className="px-6 sm:px-12 pb-8 flex items-end justify-between">
          <h2 className="font-editorial font-medium leading-[0.8] tracking-[-0.04em] text-[13vw] sm:text-[9vw] -ml-[0.06em] select-none">
            GALLERY
          </h2>
          <p className="font-grotesk text-[11px] uppercase tracking-[0.25em] pb-3 shrink-0">
            Works 01 — 05
          </p>
        </div>

        <div className="overflow-x-hidden">
          <div ref={trackRef} className="flex items-end gap-[6vw] px-6 sm:px-12 pb-16 w-max">
            {PIECES.map((p, i) => (
              <article
                key={p.title}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="w-[74vw] sm:w-[46vw] lg:w-[38vw] shrink-0"
              >
                <div className="overflow-hidden bg-[#14120f]">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-[70vw] sm:h-[52vw] lg:h-[44vw] object-cover grayscale-[0.25] contrast-[1.05]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <div>
                    <h3 className="font-editorial text-2xl sm:text-3xl italic tracking-[-0.02em]">
                      {p.title}
                    </h3>
                    <p className="font-grotesk text-[11px] uppercase tracking-[0.18em] mt-1 text-[#571b1b]">
                      {p.medium}
                    </p>
                  </div>
                  <span className="font-editorial text-4xl text-[#571b1b]">{p.year}</span>
                </div>
              </article>
            ))}
            <div className="w-[40vw] shrink-0 self-center flex items-center justify-center">
              <p className="font-grotesk text-[11px] uppercase tracking-[0.3em] text-[#571b1b] -rotate-90">
                End of walk — keep scrolling
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
