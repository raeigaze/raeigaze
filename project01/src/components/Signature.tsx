import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Signature() {
  const pathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;

    const wrapEl = wrapRef.current;
    if (!wrapEl) return;
    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: wrapEl,
          start: 'top 82%',
          end: 'bottom 55%',
          scrub: 0.4,
        },
      });
    }, wrapEl);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="w-[300px] max-w-full sm:w-[420px]">
      <svg viewBox="0 0 640 170" fill="none" className="w-full h-auto overflow-visible">
        <path
          ref={pathRef}
          d="M18 128 C 26 74, 52 22, 84 24 C 112 26, 104 78, 84 116 C 74 136, 52 138, 56 112 C 59 92, 76 84, 92 96 C 118 116, 128 60, 156 44 C 168 37, 176 46, 168 66 C 156 96, 138 124, 150 128 C 162 132, 196 108, 226 84 C 240 73, 248 80, 244 96 C 238 120, 226 132, 236 130 C 244 128, 260 116, 276 100 M 300 84 C 310 64, 330 48, 340 54 C 352 61, 340 92, 330 112 C 324 124, 314 126, 318 108 M 372 96 C 386 78, 408 66, 416 74 C 424 82, 406 104, 394 118 C 388 125, 382 126, 388 110 M 448 66 C 452 58, 462 56, 464 64 C 466 72, 456 86, 452 108 M 452 84 C 460 78, 474 78, 478 88 C 482 98, 472 112, 460 118 M 506 52 C 514 40, 530 38, 532 50 C 534 62, 522 84, 516 110 C 512 124, 504 126, 508 106"
          stroke="var(--ink)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
