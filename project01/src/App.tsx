import { useEffect, useState } from 'react';
import BlobScene from './components/BlobScene';
import Gallery from './components/Gallery';
import Signature from './components/Signature';
import Grain from './components/Grain';

export default function App() {
  const [heroIn, setHeroIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative">
      <Grain />

      {/* HERO */}
      <header
        className="relative flex h-[100svh] flex-col items-center justify-center overflow-hidden"
        style={{ background: 'radial-gradient(120% 90% at 50% 30%, #f6f2e9 0%, #efe9df 55%, #e4dccc 100%)' }}
      >
        <div className="absolute inset-0">
          <BlobScene />
        </div>

        <h1
          className={`hero-title ${heroIn ? 'is-in' : ''} absolute inset-0 flex flex-col items-center justify-center pointer-events-none`}
        >
          <span className="font-grotesk text-[11px] uppercase tracking-[0.5em] text-[#571b1b] mb-6">
            Sculptor's Studio
          </span>
          <span className="font-editorial font-light leading-[0.82] tracking-[-0.04em] text-[17vw] sm:text-[11vw] text-[#14120f] select-none">
            AELIA
          </span>
          <span className="font-editorial italic leading-none tracking-[-0.04em] text-[10vw] sm:text-[6vw] text-[#571b1b] -mt-[1.2vw] sm:-mt-[0.5vw]">
            Vale
          </span>
        </h1>

        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-12 font-grotesk text-[11px] uppercase tracking-[0.3em]">
          Contemporary Sculpture
        </div>
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-12 font-grotesk text-[11px] uppercase tracking-[0.3em] text-[#571b1b]">
          scroll
        </div>
      </header>

      {/* INTERLUDE */}
      <section className="px-6 sm:px-12 py-24 sm:py-36 overflow-hidden">
        <p className="font-editorial text-[6.5vw] sm:text-[4vw] leading-[1.05] tracking-[-0.02em] max-w-[22ch]">
          I work in <em className="text-[#571b1b]">flesh and light</em>, letting bronze remember the shape of a breath.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-10 sm:gap-24">
          <div className="max-w-md">
            <p className="font-grotesk text-[11px] uppercase tracking-[0.25em] text-[#571b1b] mb-3">The Studio</p>
            <p className="text-base leading-relaxed">
              Founded in 2019 above a disused foundry in the Balkans, my studio casts
              large-scale works in bronze, travertine and cast ink. Each piece begins as
              a hand-coiled armature, then rests for nine months before the crucible.
            </p>
          </div>
          <div className="max-w-md">
            <p className="font-grotesk text-[11px] uppercase tracking-[0.25em] text-[#571b1b] mb-3">Exhibitions</p>
            <ul className="text-base leading-relaxed space-y-2">
              <li>— “Torso of a Witness” · Galleria Meridian, Milan · 2025</li>
              <li>— “Corridor Walk” · Fotomuseo, Naples · 2024</li>
              <li>— “Nocturne in Ink” · Atelier 31, Berlin · 2023</li>
            </ul>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <Gallery />

      {/* COLOPHON / FOOTER */}
      <footer className="px-6 sm:px-12 pt-24 pb-12 border-t border-[#14120f]/15 overflow-hidden">
        <div className="flex flex-col items-start justify-between gap-12">
          <div>
            <p className="font-grotesk text-[11px] uppercase tracking-[0.3em] text-[#571b1b] mb-6">
              Aelia Vale — b. 1986, Pristina
            </p>
            <Signature />
          </div>
          <div className="font-grotesk text-[11px] uppercase tracking-[0.2em] space-y-3 text-right">
            <p>studio@aeliavale.art</p>
            <p>Vale Studio, Balkan Route 7</p>
            <p>© 2026 — All rights reserved</p>
          </div>
        </div>

        <div className="mt-20 font-editorial font-light leading-[0.85] tracking-[-0.04em] text-[16vw] sm:text-[12vw] text-[#14120f] select-none whitespace-nowrap overflow-hidden">
          AELIA VALE
        </div>
      </footer>
    </main>
  );
}
